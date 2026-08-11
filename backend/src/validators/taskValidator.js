const { allowOnlyFields } = require("../utils/validation");

// Task create/update accepts only title + description. "user_id", "role",
// "is_admin", "id", "created_at", etc. are rejected so ownership/authorization
// can never be client-controlled.
const validateTask = [
  allowOnlyFields(["title", "description"]),
  (req, res, next) => {
    const { title } = req.body;

    if (!title || String(title).trim() === "") {
      return res.status(400).json({ message: "Task title is required" });
    }

    next();
  },
];

module.exports = { validateTask };
