const express = require("express");
const { register, login } = require("../controllers/authController");
const { validateRegister } = require("../validators/authValidator");
const {
  loginLimiter,
  registerLimiter,
} = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/register", registerLimiter, validateRegister, register);
router.post("/login", loginLimiter, login);

module.exports = router;
