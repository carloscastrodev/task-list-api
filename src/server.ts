"use strict";
import express from "express";
import dotenv from "dotenv";
import taskRoutes from "@/routes/task";

dotenv.config();

const PORT = process.env["PORT"] || 3333;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks", taskRoutes);

const server = app.listen(PORT);

export default server;
