const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Sample test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Import routes (you’ll implement later)
const {router: authRoutes, verifyJwt} = require("./routes/authRoutes");
// const bookRoutes = require("./routes/bookRoutes");
// const penaltyRoutes = require("./routes/penaltyRoutes");
// const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
// app.use("/api/penalty", penaltyRoutes);
// app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
