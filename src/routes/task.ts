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
router.patch("/:id", (_, res) => {
  res.send("Patch Task");
});
router.delete("/:id", (_, res) => {
  res.send("Delete Task");
});

export default router;
