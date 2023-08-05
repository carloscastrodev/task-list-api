import { withMiddlewares } from "../withMiddlewares";

describe("@middlewares - withMiddlewares", () => {
  const middleware1 = () => "1";
  const middleware2 = () => "2";
  const routeHandler = () => "route";

  it("Should return an array with the middlewares and route handler at last position", async () => {
    const handlers = withMiddlewares({
      middlewares: [middleware1, middleware2],
      routeHandler,
    });

    expect(handlers).toHaveLength(3);

    expect(handlers[handlers.length - 1]).toEqual(routeHandler);
  });
});
