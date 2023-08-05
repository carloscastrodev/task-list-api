import { validateBody } from "@/middlewares/validateBody";
import { validateRouteParams } from "@/middlewares/validateRouteParams";
import { withMiddlewares } from "@/middlewares/withMiddlewares";
import { applySchema } from "@/schemas/applySchema";
import {
  completeTaskParamsSchema,
  createTaskBodySchema,
  updateTasksPrioritiesBodySchema,
} from "@/schemas/tasks";
import {
  completeTask,
  createTask,
  listTasks,
  updatePriorities,
} from "@/usecases/tasks";
import { findTaskById } from "@/usecases/tasks/findTaskById";
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

router.put(
  "/complete-task/:id",
  withMiddlewares({
    middlewares: [
      validateRouteParams((params) =>
        applySchema(params, completeTaskParamsSchema)
      ),
    ],
    routeHandler: async (req, res) => {
      const existingTask = await findTaskById(Number(req.params["id"]));

      if (!existingTask) {
        return res.status(404).json({ message: "Not found" });
      }

      const task = await completeTask(Number(req.params["id"]));

      return res.status(200).json(task);
    },
  })
);

router.delete("/:id", (_, res) => {
  res.send("Delete Task");
});

export default router;
