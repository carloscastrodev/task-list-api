import { validateBody } from "@/middlewares/validateBody";
import { withMiddlewares } from "@/middlewares/withMiddlewares";
import { applySchema } from "@/schemas/applySchema";
import {
  createTaskBodySchema,
  updateTasksPrioritiesBodySchema,
} from "@/schemas/tasks";
import { createTask, listTasks, updatePriorities } from "@/usecases/tasks";
import express from "express";

const router = express.Router();

router.get("/", async (_, res) => {
  const tasks = await listTasks();

  return res.json(tasks);
});

router.post(
  "/",
  withMiddlewares({
    middlewares: [
      validateBody((body) => applySchema(body, createTaskBodySchema)),
    ],
    routeHandler: async (req, res) => {
      const task = await createTask(req.body);

      return res.status(201).json(task);
    },
  })
);

router.put(
  "/priorities",
  withMiddlewares({
    middlewares: [
      validateBody((body) =>
        applySchema(body, updateTasksPrioritiesBodySchema)
      ),
    ],
    routeHandler: async (req, res) => {
      await updatePriorities(req.body);

      return res.status(200).send();
    },
  })
);

router.put("/complete-task/:id", (_, res) => {
  res.send("Complete task");
});

router.delete("/:id", (_, res) => {
  res.send("Delete Task");
});

export default router;
