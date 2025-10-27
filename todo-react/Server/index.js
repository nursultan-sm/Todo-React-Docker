import express from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "tasks.json");
const BUILD_PATH = join(__dirname, "build"); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(BUILD_PATH));

async function readTasks() {
  try {
    const raw = await readFile(DATA_PATH, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    return [];
  }
}

async function writeTasks(tasks) {
  await writeFile(DATA_PATH, JSON.stringify(tasks, null, 2), "utf8");
}

app.get("/tasks", async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Неверный текст задачи" });
  }

  const tasks = await readTasks();
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  await writeTasks(tasks);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  const tasks = await readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Не найдена задача" });

  tasks[idx] = { ...tasks[idx], ...updates };
  await writeTasks(tasks);
  res.json(tasks[idx]);
});

app.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  let tasks = await readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Не найдена задача" });

  const removed = tasks.splice(idx, 1)[0];
  await writeTasks(tasks);
  res.json({ removed });
});

app.use((req, res) => {
  res.sendFile(join(BUILD_PATH, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Backend running http://localhost:${PORT}`);
});
