import { BadRequestException } from "@/errors";
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

  it("Should throw BadRequestException if the body is invalid", async () => {
    mockValidator.mockImplementationOnce(() => ({
      isValid: false,
    }));

    const wrapper = () =>
      validateRouteParams(mockValidator)(mockReq, mockRes, mockNext);

    expect(wrapper).toThrow(BadRequestException);
  });
});
