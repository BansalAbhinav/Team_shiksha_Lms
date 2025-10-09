
import { config } from "dotenv";
import connectDB from "./config/db.js";

config();
connectDB();

import express, { json } from "express";
import cors from "cors";

import bookRoutes from "./routes/bookRoutes.js";
import { router as authRoutes, verifyJwt } from "./routes/authRoutes.js";

// Import routes (you’ll implement later)
// import penaltyRoutes from "./routes/penaltyRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";


const app = express();

app.use(cors());
app.use(json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// verifyJwt is not required for auth routes
app.use("/api/auth", authRoutes);
app.use("/api/books", verifyJwt, bookRoutes);
// app.use("/api/penalty", penaltyRoutes);
app.use("/api/reviews",reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
