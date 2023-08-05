import request from "supertest";
import server from "@/server";
import prisma from "@/db/prismaClient";
import { TaskStatus } from "@/types/tasks";
import { Prisma, Task } from "@prisma/client";

describe("Tasks", () => {
  const mockPartialTask: Partial<Task> = {
    description: "Task",
    priority: 0,
  };

  const insertMockTasks = async () => {
    const task1 = await prisma.task.create({
      data: {
        id: 1,
        description: "Task 1",
        priority: 0,
        status: TaskStatus.PENDING,
      },
    });

    const task0 = await prisma.task.create({
      data: {
        id: 0,
        description: "Task 0",
        priority: -1,
        status: TaskStatus.PENDING,
      },
    });

    const subtask = await prisma.task.create({
      data: {
        id: 2,
        description: "Subtask",
        priority: 0,
        status: TaskStatus.PENDING,
        parentTaskId: task1.id,
      },
    });

    return [task1, task0, subtask];
  };

  const noExistingTaskId = 10;
  const existingTaskId = 1;

  const getAllTasks = async () => {
    return await prisma.task.findMany({
      orderBy: {
        priority: "asc",
      },
      where: {
        deletedAt: null,
        parentTaskId: null,
      },
    });
  };

  beforeAll(async () => {
    prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    prisma.$disconnect();
    server.close();
  });

  describe("#GET /tasks", () => {
    it("Should return an empty array when no task exists", async () => {
      const { body } = await request(server).get("/tasks").send();

      expect(Array.isArray(body)).toEqual(true);

      expect(body).toHaveLength(0);
    });

    it("Should return an array of all tasks ordered by priority ascending", async () => {
      await insertMockTasks();

      const { body } = await request(server).get("/tasks").send();

      expect(Array.isArray(body)).toEqual(true);
      expect(body).toHaveLength(2);
      expect(body[0].priority).toEqual(-1);
      expect(body[1].priority).toEqual(0);
    });

    it("Should not return deleted tasks", async () => {
      await insertMockTasks();

      await prisma.task.create({
        data: {
          description: "Task 1",
          priority: 0,
          status: TaskStatus.DELETED,
          deletedAt: new Date(),
        },
      });

      const { body } = await request(server).get("/tasks").send();

      expect(Array.isArray(body)).toEqual(true);
      expect(body).toHaveLength(2);
      expect(body[0].priority).toEqual(-1);
      expect(body.every((task: Task) => task.deletedAt === null)).toEqual(true);
    });

    it("Should not return tasks that have a parent", async () => {
      await insertMockTasks();

      const { body } = await request(server).get("/tasks").send();

      expect(Array.isArray(body)).toEqual(true);
      expect(body).toHaveLength(2);
      expect(body.every((task: Task) => task.parentTaskId === null)).toEqual(
        true
      );
    });

    it("Should return subtasks of each task", async () => {
      await insertMockTasks();

      const { body } = await request(server).get("/tasks").send();

      expect(
        body.some(
          (task: Prisma.TaskGetPayload<{ include: { subtasks: true } }>) =>
            task.subtasks.length > 0
        )
      ).toEqual(true);
    });
  });

  describe("#POST /tasks", () => {
    it("Should create a task and return the resulting task", async () => {
      const { body } = await request(server)
        .post("/tasks")
        .send(mockPartialTask);

      expect(body.id).not.toBeNull();
      expect(body.description).toEqual(mockPartialTask.description);
      expect(body.priority).toEqual(mockPartialTask.priority);
    });

    it("Should return HTTP 201 Created when the task is created correctly", async () => {
      const { status } = await request(server)
        .post("/tasks")
        .send(mockPartialTask);

      expect(status).toEqual(201);
    });

    it("Should return HTTP 400 Bad Request when the request body is not properly formatted", async () => {
      const { status } = await request(server)
        .post("/tasks")
        .send({ ...mockPartialTask, priority: null });

      expect(status).toEqual(400);
    });

    it("Should return HTTP 400 Bad Request when trying to create add a subtask to a task that does not exists", async () => {
      const { status } = await request(server)
        .post("/tasks")
        .send({ ...mockPartialTask, parentTaskId: 10 });

      expect(status).toEqual(400);
    });
  });

  describe("#PUT /tasks/priorities", () => {
    it("Should update the priorities of every task included in the body", async () => {
      const [task1, task2] = await insertMockTasks();

      const newPriorityTask1 = 10;
      const newPriorityTask2 = 50;

      await request(server)
        .put("/tasks/priorities")
        .send({
          [task1!.id]: newPriorityTask1,
          [task2!.id]: newPriorityTask2,
        });

      const tasks = await getAllTasks();

      expect(tasks[0]?.priority).toEqual(newPriorityTask1);
      expect(tasks[1]?.priority).toEqual(newPriorityTask2);
    });

    it("Should return HTTP 200 OK when priorities are correctly updated", async () => {
      const [task1, task2] = await insertMockTasks();

      const { status } = await request(server)
        .put("/tasks/priorities")
        .send({
          [task1!.id]: 10,
          [task2!.id]: 50,
        });

      expect(status).toEqual(200);
    });

    it("Should return HTTP 200 OK if any of the tasks in the body map dont exist", async () => {
      const { status } = await request(server)
        .put("/tasks/priorities")
        .send({
          [noExistingTaskId]: 0,
        });

      expect(status).toEqual(200);
    });

    it("Should return HTTP 400 Bad Request when the request body is not properly formatted", async () => {
      const { status } = await request(server)
        .put("/tasks/priorities")
        .send({ x: "y" });

      expect(status).toEqual(400);
    });
  });

  describe("#PUT /tasks/complete-task/:id", () => {
    it("Should mark the task identified by :id as complete and return the updated task", async () => {
      await insertMockTasks();

      const { body } = await request(server)
        .put(`/tasks/complete-task/${existingTaskId}`)
        .send();

      expect(body.id).toEqual(existingTaskId);
      expect(body.status).toEqual(TaskStatus.DONE);
    });

    it("Should return HTTP 200 OK when the task is updated correctly", async () => {
      await insertMockTasks();

      const { status } = await request(server)
        .put(`/tasks/complete-task/${existingTaskId}`)
        .send();

      expect(status).toEqual(200);
    });

    it("Should return HTTP 404 Not Found when the task identified by :id does not exist", async () => {
      await insertMockTasks();

      const { status } = await request(server)
        .put(`/tasks/complete-task/${noExistingTaskId}`)
        .send();

      expect(status).toEqual(404);
    });
  });

  describe("#DELETE /tasks/:id", () => {
    it("Should delete task identified by :id", async () => {
      await insertMockTasks();

      await request(server).delete(`/tasks/${existingTaskId}`).send();

      const tasks = await getAllTasks();

      expect(tasks.length).toEqual(1);
      expect(tasks.find((t) => t.id === existingTaskId)).toBeUndefined();
    });

    it("Should return HTTP 204 No Content when the task is deleted correctly", async () => {
      await insertMockTasks();

      const { status } = await request(server)
        .delete(`/tasks/${existingTaskId}`)
        .send();

      expect(status).toEqual(204);
    });

    it("Should return HTTP 404 Not Found when the task identified by :id does not exist", async () => {
      await insertMockTasks();

      const { status } = await request(server)
        .delete(`/tasks/${noExistingTaskId}`)
        .send();

      expect(status).toEqual(404);
    });
  });
});
