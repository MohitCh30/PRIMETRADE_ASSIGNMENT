const express = require("express");
const auth = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");
const { validateTask } = require("../validators/taskValidator");

const router = express.Router();

router.use(auth);

router.get("/", taskController.getTasks);
router.post("/", validateTask, taskController.createTask);
router.put("/:id", validateTask, taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;