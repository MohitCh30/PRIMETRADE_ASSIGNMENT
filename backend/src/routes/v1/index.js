const express = require("express");

const authRoutes = require("../authRoutes");
const taskRoutes = require("../taskRoutes");
const healthRoutes = require("../healthRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/health", healthRoutes);

module.exports = router;
