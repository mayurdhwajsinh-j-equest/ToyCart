// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import productRoutes from "./routes/products.js";
// import newsRoutes from "./routes/news.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Health check route
// app.get("/api/health", (req, res) => {
//   res.json({ status: "Server is running", timestamp: new Date().toISOString() });
// });

// // API Routes
// app.use("/api/products", productRoutes);
// app.use("/api/news", newsRoutes);

// // Sample API routes (to be implemented)
// app.get("/api/toys", (req, res) => {
//   res.json({ toys: [], message: "Toys endpoint - check /api/products instead" });
// });

// app.post("/api/toys", (req, res) => {
//   res.json({ message: "Use POST /api/products instead" });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Error:", err);
//   res.status(err.status || 500).json({
//     error: err.message || "Internal server error",
//     status: err.status || 500,
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found", status: 404 });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });