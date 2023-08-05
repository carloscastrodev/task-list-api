import { Request, Response } from "express";

export const mockReq = {
  body: {},
  params: {},
} as Request;

export const mockResStatus = jest.fn();
export const mockResJson = jest.fn();
export const mockRes = {
  status: mockResStatus,
  json: mockResJson,
} as unknown as Response;

export const mockNext = jest.fn();
