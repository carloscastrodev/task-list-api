import { validateRouteParams } from "../validateRouteParams";
import {
  mockNext,
  mockReq,
  mockRes,
  mockResJson,
  mockResStatus,
} from "@/mocks/express";

describe("@middlewares - validateRouteParams", () => {
  const mockValidator = jest.fn();

  beforeEach(() => {
    mockValidator.mockImplementation(() => ({
      isValid: true,
    }));

    mockResStatus.mockImplementation(() => mockRes);
    mockResJson.mockImplementation(() => mockRes);

    mockRes.status;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should call the validator callback function with the request params", async () => {
    validateRouteParams(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockValidator).toHaveBeenCalledWith(mockReq.params);
  });

  it("Should call the next handler if the params are valid", async () => {
    validateRouteParams(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("Should call res.status with 400 if the params are invalid", async () => {
    mockValidator.mockImplementationOnce(() => ({
      isValid: false,
    }));

    validateRouteParams(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it("Should call res.json passing the message returned by the validator", async () => {
    mockValidator.mockImplementationOnce(() => ({
      isValid: false,
      message: "Body Invalid",
    }));

    validateRouteParams(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({ message: "Body Invalid" });
  });

  it("Should call res.json passing a fallback message if the validator doesn't return a message", async () => {
    mockValidator.mockImplementationOnce(() => ({
      isValid: false,
    }));

    validateRouteParams(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({ message: "Bad Request" });
  });
});
