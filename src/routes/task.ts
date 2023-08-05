import { listTasks } from "@/usecases/tasks";
import express from "express";

const router = express.Router();

router.get("/", async (_, res) => {
  const tasks = await listTasks();

  return res.json(tasks);
});

router.post("/", (_, res) => {
  res.send("Post Task");
});

router.put("/priorities", (_, res) => {
  res.send("Put Tasks Priorities");
});

router.put("/complete-task/:id", (_, res) => {
  res.send("Complete task");
});

router.delete("/:id", (_, res) => {
  res.send("Delete Task");
});

export default router;
