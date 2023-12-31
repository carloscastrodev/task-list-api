"use strict";
import express from "express";
import dotenv from "dotenv";
import taskRoutes from "@/routes/tasks";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import prisma from "@/db/prismaClient";
import { globalErrorHandler } from "@/middlewares/globalErrorHandler";

dotenv.config();

const PORT = process.env["PORT"] || 3333;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

const jsDocOptions: swaggerJSDoc.Options = {
  apis: [`${__dirname}/routes/*.js`, `${__dirname}/routes/*.ts`],
  definition: {
    openapi: "3.0.0",
    info: {
      description: "Simple API for Buzzvel hiring test",
      version: "1.0.0",
      title: "Task List API",
    },
  },
};

const openApiSpec = swaggerJSDoc(jsDocOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use("/tasks", taskRoutes);

app.use(globalErrorHandler);

const server = app.listen(PORT);

export default server;

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  server.close((err) => {
    if (err) {
      return process.exit(1);
    }

    process.exit(0);
  });
});
