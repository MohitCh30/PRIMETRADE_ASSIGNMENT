const validator = require("validator");
const { allowOnlyFields } = require("../utils/validation");

// Registration accepts only these fields. "role", "is_admin", "id", etc. are
// rejected outright so privileges can never be client-controlled.
const validateRegister = [
  allowOnlyFields(["name", "email", "password"]),
  (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    next();
  },
];

module.exports = { validateRegister };
