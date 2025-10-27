import { useState, useEffect } from "react";
import { Box, Button, TextField, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";

const API = "http://localhost:5000";

export const AddTask = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  const handleAddTask = async () => {
    if (task.trim() === "") return;
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task }),
    });
    if (res.ok) {
      setTask("");
      fetchTasks();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    if (res.ok) fetchTasks();
  };

  const toggleDone = async (id: string, done: boolean) => {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    });
    if (res.ok) fetchTasks();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Задача"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          fullWidth
          onKeyDown={(e) => { if (e.key === "Enter") handleAddTask(); }}
        />
        <Button variant="contained" onClick={handleAddTask}>
          Добавить
        </Button>
      </Box>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 8,
              borderBottom: "1px solid #eee",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ textDecoration: t.done ? "line-through" : "none" }}>
                {t.text}
              </span>
              <small style={{ color: "#777" }}>
                {new Date(t.createdAt).toLocaleString()}
              </small>
            </div>

            <div>
              <Tooltip title={t.done ? "Отметить как невыполненная" : "Отметить как выполненная"}>
                <IconButton onClick={() => toggleDone(t.id, t.done)}>
                  {t.done ? <UndoIcon /> : <CheckIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Удалить">
                <IconButton color="error" onClick={() => handleDelete(t.id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </li>
        ))}
      </ul>
    </Box>
  );
};
