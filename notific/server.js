import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Needed for ES6 modules

const app = express();

// Get __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  // Send the index.html file using res.sendFile
  const filePath = path.join(__dirname, "index.html");
  res.sendFile(filePath);
});

app.get("/new", (req, res) => {
  const filePath = path.join(__dirname, "hello.html");
  res.sendFile(filePath);
});

app.listen(4000, () => {
  console.log("Server started on http://localhost:4000");
});
