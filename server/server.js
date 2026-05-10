import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import seedAdmin from "./utils/seedAdmin.js";

// =====================
// Setup __dirname (ESM)
// =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================
// ENV CONFIG
// =====================
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// =====================
// TRUST PROXY (Railway required)
// =====================
app.set("trust proxy", 1);

// =====================
// CORS CONFIG (FIXED + SAFE)
// =====================
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    const clientUrl = process.env.CLIENT_URL;

    // Allow Postman / server-to-server
    if (!origin) return callback(null, true);

    // DEV MODE: allow all origins
    if (clientUrl === "*") {
      return callback(null, true);
    }

    const allowedOrigins = (clientUrl || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Optional: allow but do not block (prevents Railway issues)
    return callback(null, true);
  },
};

app.use(cors(corsOptions));

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());
app.use(morgan("dev"));

// =====================
// TEST ROUTES
// =====================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Team Task Manager API is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is available",
  });
});

// =====================
// API ROUTES
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =====================
// ERROR HANDLERS
// =====================
app.use(notFound);
app.use(errorHandler);

// =====================
// PORT (RAILWAY IMPORTANT)
// =====================
const PORT = process.env.PORT || 5000;

let server;

// =====================
// GRACEFUL SHUTDOWN
// =====================
const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down...`);

  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// =====================
// START SERVER
// =====================
const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();

    server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();