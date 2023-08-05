import { RequestHandler } from "express";

export type TransformerFunction = (value: any) => any;

export type TransformerMap = Record<string, TransformerFunction>;

export const transformParams: (
  transformerMap: TransformerMap
) => RequestHandler = (transformerMap) => {
  return (req, _, next) => {
    const keysToTransform = Object.keys(transformerMap);

    keysToTransform.forEach((key) => {
      const transformerFunction = transformerMap[key]!;
      const transformedValue = transformerFunction(req.params[key]);

      req.params[key] = transformedValue;
    });

    return next();
  };
};
