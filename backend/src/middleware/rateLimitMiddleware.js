const rateLimit = require("express-rate-limit");

const message = { message: "Too many requests, please try again later" };

// Login: small allowance per IP to slow down credential stuffing / brute force.
const loginLimiter = rateLimit({
  windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 5,
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message,
});

// Registration: registrations are rarer than logins; keep a low hourly cap.
const registerLimiter = rateLimit({
  windowMs:
    Number(process.env.REGISTER_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000,
  max: Number(process.env.REGISTER_RATE_LIMIT_MAX) || 3,
  standardHeaders: true,
  legacyHeaders: false,
  message,
});

module.exports = { loginLimiter, registerLimiter };
