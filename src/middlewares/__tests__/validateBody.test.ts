import { BadRequestException } from "@/errors";
import { validateBody } from "../validateBody";
import {
  mockNext,
  mockReq,
  mockRes,
  mockResJson,
  mockResStatus,
} from "@/mocks/express";

describe("@middlewares - validateBody", () => {
  const mockValidator = jest.fn();

  beforeEach(() => {
    mockValidator.mockImplementation(() => ({
      isValid: true,
    }));

    mockResStatus.mockImplementation(() => mockRes);
    mockResJson.mockImplementation(() => mockRes);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should call the validator callback function with the request body", async () => {
    validateBody(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockValidator).toHaveBeenCalledWith(mockReq.body);
  });

  it("Should call the next handler if the body is valid", async () => {
    validateBody(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("Should throw BadRequestException if the body is invalid", async () => {
    mockValidator.mockImplementationOnce(() => ({
      isValid: false,
    }));

    const wrapper = () =>
      validateBody(mockValidator)(mockReq, mockRes, mockNext);

    expect(wrapper).toThrow(BadRequestException);
  });
});
