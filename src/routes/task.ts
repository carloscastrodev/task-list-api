import { transformParams } from "@/middlewares/transformParams";
import { validateBody } from "@/middlewares/validateBody";
import { validateRouteParams } from "@/middlewares/validateRouteParams";
import { withMiddlewares } from "@/middlewares/withMiddlewares";
import { applySchema } from "@/schemas/applySchema";
import {
  completeTaskParamsSchema,
  createTaskBodySchema,
  deleteTaskParamsSchema,
  updateTasksPrioritiesBodySchema,
} from "@/schemas/tasks";
import {
  completeTask,
  createTask,
  deleteTask,
  listTasks,
  updatePriorities,
  findTaskById,
} from "@/usecases/tasks";
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
      transformParams({ id: Number }),
    ],
    routeHandler: async (req, res) => {
      const existingTask = await findTaskById(
        req.params["id"] as unknown as number
      );

      if (!existingTask) {
        return res.status(404).json({ message: "Not found" });
      }

      const task = await completeTask(req.params["id"] as unknown as number);

      return res.status(200).json(task);
    },
  })
);

router.delete(
  "/:id",
  withMiddlewares({
    middlewares: [
      validateRouteParams((params) =>
        applySchema(params, deleteTaskParamsSchema)
      ),
      transformParams({ id: Number }),
    ],
    routeHandler: async (req, res) => {
      const existingTask = await findTaskById(
        req.params["id"] as unknown as number
      );

      if (!existingTask) {
        return res.status(404).json({ message: "Not found" });
      }

      await deleteTask(req.params["id"] as unknown as number);

      return res.status(204).send();
    },
  })
);

export default router;
