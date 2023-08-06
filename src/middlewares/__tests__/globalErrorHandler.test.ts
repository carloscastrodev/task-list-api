import { HTTPException } from "@/errors";
import {
  mockNext,
  mockReq,
  mockRes,
  mockResStatus,
  mockResJson,
} from "@/mocks/express";
import { globalErrorHandler } from "@/middlewares/globalErrorHandler";

describe("@middlewares - globalErrorHandler", () => {
  beforeEach(() => {
    mockResStatus.mockImplementation(() => mockRes);
    mockResJson.mockImplementation(() => mockRes);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should return the correct status and message when next handler throws with a HTTPException", async () => {
    const exception = new HTTPException(401, "Unauthorized");

    globalErrorHandler(exception, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(exception.status);

    expect(mockRes.json).toHaveBeenCalledWith({ message: exception.message });
  });

  it("Should return status 500 and correct message when next handler throws with an Error", async () => {
    const exception = new Error("Error");

    globalErrorHandler(exception, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);

    expect(mockRes.json).toHaveBeenCalledWith({ message: exception.message });
  });

  it("Should return status 500 and message 'Internal Server Error' when error is not known", async () => {
    const UnknownErrorClass = class UEC {};
    const exception = new UnknownErrorClass();

    globalErrorHandler(exception, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);

    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });

  it("Should call the next handler", async () => {
    globalErrorHandler(new Error(), mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
