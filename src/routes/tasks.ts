import { BadRequestException, NotFoundException } from "@/errors";
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

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API endpoints for managing tasks
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get a list of tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Returns a list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaskWithSubtasks'
 */
router.get("/", async (_, res) => {
  const tasks = await listTasks();

  return res.json(tasks);
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskBody'
 *     responses:
 *       201:
 *         description: Returns the created task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: If creating a subtask and the parent task does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/",
  withMiddlewares({
    middlewares: [
      validateBody((body) => applySchema(body, createTaskBodySchema)),
    ],
    routeHandler: async (req, res, next) => {
      if (req.body.parentTaskId) {
        const parentTask = await findTaskById(req.body.parentTaskId);

        if (!parentTask) {
          return next(new BadRequestException("Parent task does not exist"));
        }
      }

      const task = await createTask(req.body);

      return res.status(201).json(task);
    },
  })
);

/**
 * @swagger
 * /tasks/priorities:
 *   put:
 *     summary: Update tasks priorities
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTasksPrioritiesBody'
 *     responses:
 *       200:
 *         description: Tasks priorities have been updated.
 */
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

/**
 * @swagger
 * /tasks/complete-task/{id}:
 *   put:
 *     summary: Complete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task to complete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the completed task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/complete-task/:id",
  withMiddlewares({
    middlewares: [
      validateRouteParams((params) =>
        applySchema(params, completeTaskParamsSchema)
      ),
      transformParams({ id: Number }),
    ],
    routeHandler: async (req, res, next) => {
      const existingTask = await findTaskById(
        req.params["id"] as unknown as number
      );

      if (!existingTask) {
        return next(new NotFoundException("Task not found"));
      }

      const task = await completeTask(req.params["id"] as unknown as number);

      return res.status(200).json(task);
    },
  })
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task has been deleted.
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  "/:id",
  withMiddlewares({
    middlewares: [
      validateRouteParams((params) =>
        applySchema(params, deleteTaskParamsSchema)
      ),
      transformParams({ id: Number }),
    ],
    routeHandler: async (req, res, next) => {
      const existingTask = await findTaskById(
        req.params["id"] as unknown as number
      );

      if (!existingTask) {
        return next(new NotFoundException("Task not found"));
      }

      await deleteTask(req.params["id"] as unknown as number);

      return res.status(204).send();
    },
  })
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         description:
 *           type: string
 *         priority:
 *           type: string
 *         status:
 *           type: number
 *           enum: [0, 1, 2]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         doneAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         parentTaskId:
 *           type: integer
 *           nullable: true
 *         subtasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *       example:
 *         id: 1
 *         description: "Task 0"
 *         priority: 0
 *         status: 1
 *         createdAt: '2023-08-06T15:14:53.935Z'
 *         doneAt: null
 *         deletedAt: null
 *         parentTaskId: null
 *         subtasks: []
 *       required:
 *         - description
 *         - priority
 *     TaskWithSubtasks:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         description:
 *           type: string
 *         priority:
 *           type: string
 *         status:
 *           type: number
 *           enum: [0, 1, 2]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         doneAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         parentTaskId:
 *           type: integer
 *           nullable: true
 *         subtasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *       example:
 *         id: 1
 *         description: "Task 0"
 *         priority: 0
 *         status: 1
 *         createdAt: '2023-08-06T15:14:53.935Z'
 *         doneAt: null
 *         deletedAt: null
 *         parentTaskId: null
 *         subtasks:
 *           - id: 2
 *             description: "Subtask 1"
 *             priority: 0
 *             status: 1
 *             createdAt: '2023-08-06T15:14:53.935Z'
 *             doneAt: null
 *             deletedAt: null
 *             parentTaskId: 1
 *           - id: 3
 *             description: "Subtask 2"
 *             priority: 1
 *             status: 1
 *             createdAt: '2023-08-06T15:14:53.935Z'
 *             doneAt: null
 *             deletedAt: null
 *             parentTaskId: 1
 *       required:
 *         - description
 *         - priority
 *     CreateTaskBody:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         priority:
 *           type: number
 *         parentTaskId:
 *           type: integer
 *       required:
 *         - description
 *         - priority
 *     UpdateTasksPrioritiesBody:
 *       type: object
 *       additionalProperties:
 *         type: number
 *       example:
 *         1: 1
 *         2: 2
 *         3: 5
 *         4: 4
 *         5: 3
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */
