const express = require('express');
const router = express.Router();
const { getPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
router.get('/',protect, getPosts);

module.exports = router;