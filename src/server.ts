"use strict";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env["PORT"] || 3333;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.send("Hello World App1");
});

app.listen(PORT, () => {
  console.log("Server listening on PORT", PORT);
});
