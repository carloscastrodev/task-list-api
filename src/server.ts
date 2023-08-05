"use strict";
import express from "express";
import dotenv from "dotenv";
import taskRoutes from "@/routes/task";

dotenv.config();

const PORT = process.env["PORT"] || 3333;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/task", taskRoutes);

app.listen(PORT, () => {
  console.log("Server listening on PORT", PORT);
});

export default app;
