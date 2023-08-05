describe("#GET /tasks", () => {
  it("Should return an empty array when no task exists", async () => {});

  it("Should return an array of all tasks", async () => {});
});

describe("#Post /tasks", () => {
  it("Should create a task and return the resulting task", async () => {});

  it("Should return HTTP 201 Created when the task is created correctly", async () => {});

  it("Should return HTTP 400 Bad Request when the request body is not properly formatted", async () => {});
});

describe("#Put /tasks/priorities", () => {
  it("Should update the priorities of every task included in the body", async () => {});

  it("Should return HTTP 200 OK when priorities are correctly updated", async () => {});

  it("Should return HTTP 400 Bad Request when the request body is not properly formatted", async () => {});
});

describe("#Patch /tasks/:id", () => {
  it("Should update the task identified by :id and return the updated task", async () => {});

  it("Should return HTTP 200 OK when the task is updated correctly", async () => {});

  it("Should return HTTP 404 Not Found when the task identified by :id does not exist", async () => {});

  it("Should return HTTP 400 Bad Request when the request body is not properly formatted", async () => {});
});

describe("#Delete /tasks/:id", () => {
  it("Should delete task identified by :id", async () => {});

  it("Should return HTTP 204 No Content when the task is deleted correctly", async () => {});

  it("Should return HTTP 404 Not Found when the task identified by :id does not exist", async () => {});
});
