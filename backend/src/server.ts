import express from "express";
import cors from "cors";
import { loadEnv } from "./env";
import { askStructured } from "./ask-core";

loadEnv();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json());

app.get("/", async (req, res) => {
  return res.status(200).json({
    message: "server up!!!",
  });
});
app.post("/ask", async (req, res) => {
  try {
    const { query } = req.body ?? {};
    if (!query || !String(query).trim()) {
      return res.status(400).json({
        error: "Field 'query' is required!!!",
      });
    }
    const queryResult = await askStructured(query);
    return res.status(200).json(queryResult);
  } catch (error: any) {
    console.error("ASK ERROR 👉", error);

    return res.status(500).json({
      error: "Failed to answer",
      errorMessage: error?.message ?? error,
    });
  }
});

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`API Server is listening on port ${PORT}`);
});

// keep process alive explicitly
server.on("error", err => {
  console.error("Server error:", err);
});
