const validator = require("validator");

const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  next();
};

module.exports = { validateRegister };