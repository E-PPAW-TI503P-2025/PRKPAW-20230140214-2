const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ==== SERVE FOLDER UPLOADS ====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

const presensiRoutes = require("./express-demo/routes/presensi");
const reportRoutes = require("./express-demo/routes/reports");
const authRoutes = require("./express-demo/routes/auth");
const bookRoutes = require("./express-demo/routes/books");

app.use("/api/books", bookRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);

// ==== LISTEN PALING TERAKHIR ====
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
