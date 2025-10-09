import { config } from "dotenv";
config();

import connectDB from "./config/db.js";
import express, { json } from "express";
import cors from "cors";

import bookRoutes from "./routes/bookRoutes.js";
import { router as authRoutes, verifyJwt } from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
// import penaltyRoutes from "./routes/penaltyRoutes.js"; // optional future route

// Connect to Database
connectDB();

const app = express();

// Enhanced CORS configuration for team access
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins (you can restrict to specific domains later)
    callback(null, true);
  },
  credentials: true,
}));

// Middleware
app.use(json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is working!" });
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", bookRoutes);
app.use("/api/reviews", verifyJwt, reviewRoutes);
// app.use("/api/penalty", penaltyRoutes); // optional

// Server Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT,  () => {
  console.log(` Local access: http://localhost:${PORT}`);
});
