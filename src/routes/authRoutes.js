const express = require("express");
const { register, login, getLoggedInUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); // ✅ Protect middleware

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/loggedUser", protect, getLoggedInUser); // ✅ Secure route

module.exports = router;
