import { TransformerMap, transformParams } from "@/middlewares/transformParams";
import { mockNext, mockReq, mockRes } from "@/mocks/express";

describe("@middlewares - transformParams", () => {
  const transformerFunction = jest.fn();
  const transformerMap: TransformerMap = {
    id: transformerFunction,
  };

  beforeEach(() => {
    transformerFunction.mockImplementation((v: string) => Number(v));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should apply each transformer function to the request params correctly", async () => {
    const stringId = "10";
    const numberId = Number(stringId);

    mockReq.params = {
      id: stringId,
    };

    transformParams(transformerMap)(mockReq, mockRes, mockNext);

    expect(transformerFunction).toHaveBeenCalledWith(stringId);
    expect(mockReq.params["id"]).toEqual(numberId);
  });

  it("Should call the next handler", async () => {
    transformParams(transformerMap)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
