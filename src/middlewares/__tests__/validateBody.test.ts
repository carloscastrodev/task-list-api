import { Request, Response } from "express";
import { validateBody } from "../validateBody";

describe("@middlewares - validateBody", () => {
  const mockReq = {
    body: {},
  } as Request;

  const mockResStatus = jest.fn();
  const mockResJson = jest.fn();
  const mockRes = {
    status: mockResStatus,
    json: mockResJson,
  } as unknown as Response;

  const mockNext = jest.fn();
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

  it("Should call the validator callback function with the request body", async () => {
    validateBody(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockValidator).toHaveBeenCalledWith(mockReq.body);
  });

  it("Should call the next handler if the body is valid", async () => {
    validateBody(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("Should call res.status with 400 if the body is invalid", async () => {
    mockValidator.mockImplementationOnce(() => ({
      isValid: false,
    }));

    validateBody(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it("Should call res.json passing the message returned by the validator", async () => {
    mockValidator.mockImplementationOnce(() => ({
      isValid: false,
      message: "Body Invalid",
    }));

    validateBody(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({ message: "Body Invalid" });
  });

  it("Should call res.json passing a fallback message if the validator doesn't return a message", async () => {
    mockValidator.mockImplementationOnce(() => ({
      isValid: false,
    }));

    validateBody(mockValidator)(mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({ message: "Bad Request" });
  });
});
