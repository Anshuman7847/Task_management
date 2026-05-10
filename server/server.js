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

import {
  errorHandler,
  notFound,
} from "./middleware/errorMiddleware.js";

import seedAdmin from "./utils/seedAdmin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

await connectDB();
await seedAdmin();

const app = express();


// ======================
// CORS FIX
// ======================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


// ======================
// MIDDLEWARE
// ======================

app.use(express.json());
app.use(morgan("dev"));


// ======================
// TEST ROUTES
// ======================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Team Task Manager API is running",
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is available",
  });
});


// ======================
// API ROUTES
// ======================

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);


// ======================
// ERROR HANDLER
// ======================

app.use(notFound);
app.use(errorHandler);


// ======================
// SERVER
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});