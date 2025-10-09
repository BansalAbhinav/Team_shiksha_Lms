
import { config } from "dotenv";
config();
import connectDB from "./config/db.js";
connectDB();
import express, { json } from "express";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes.js";
import { router as authRoutes, verifyJwt } from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js"
// Import routes (you’ll implement later)
// import penaltyRoutes from "./routes/penaltyRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";


const app = express();

// Enhanced CORS configuration for team access
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // allow all origins dynamically
  },
  credentials: true,
}));


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
app.use("/api",verifyJwt, bookRoutes);
app.use("/api/reviews",verifyJwt, reviewRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Bind to all interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📡 Local access: http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://[YOUR_IP]:${PORT}`);
  console.log(`💡 Team members can access using your local IP address`);
});
