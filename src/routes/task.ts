import express from "express";

const router = express.Router();

/* Task resource routes */
router.get("/", (_, res) => {
  res.send("Get Tasks");
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
