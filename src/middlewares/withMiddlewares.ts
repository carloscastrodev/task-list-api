import { RequestHandler } from "express";

export const withMiddlewares: (args: {
  middlewares: RequestHandler[];
  routeHandler: RequestHandler;
}) => RequestHandler[] = ({ middlewares, routeHandler }) => [
  ...middlewares,
  routeHandler,
];
