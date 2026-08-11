const express = require("express");
const cors = require("cors");

const v1Routes = require("./routes/v1");
const setupSwagger = require("./docs/swagger");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Only the real frontend origin is allowed. Wildcard ("*") is not acceptable
// here because we also permit the Authorization header.
const allowedOrigins = (process.env.CORS_ORIGINS ||
  "https://primetrade-assignment-three.vercel.app,http://localhost:5173"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin / non-browser requests (no Origin header) and the
      // explicitly whitelisted frontend origins.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

app.use("/api/v1", v1Routes);
setupSwagger(app);

// Central error handler — any uncaught controller error returns a clean 500
// instead of crashing the process.
app.use(errorMiddleware);

module.exports = app;