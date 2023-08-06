"use strict";
import express from "express";
import dotenv from "dotenv";
import taskRoutes from "@/routes/task";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import prisma from "@/db/prismaClient";

dotenv.config();

const PORT = process.env["PORT"] || 3333;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const jsDocOptions: swaggerJSDoc.Options = {
  apis: ["@/src/routes/*.ts"],
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
