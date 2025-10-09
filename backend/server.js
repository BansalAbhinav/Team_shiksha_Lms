
import { config } from "dotenv";
config();
import connectDB from "./config/db.js";
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

// Date test route
app.get("/api/test-dates", (req, res) => {
  const now = new Date();
  const issueDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = new Date(issueDate);
  dueDate.setDate(issueDate.getDate() + 30);
  
  res.json({
    message: "Date calculation test",
    current: now.toISOString(),
    issueDate: issueDate.toISOString(),
    dueDate: dueDate.toISOString(),
    daysUntilDue: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)),
    localDates: {
      current: now.toLocaleDateString(),
      issue: issueDate.toLocaleDateString(),
      due: dueDate.toLocaleDateString()
    }
  });
});

// verifyJwt is not required for auth routes
app.use("/api/auth", authRoutes);
app.use("/api", bookRoutes);
// app.use("/api/penalty", penaltyRoutes);
// app.use("/api/reviews",reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
