const express = require("express");

const {
    addComment,
    getComments,
    deleteComment
} = require("../controllers/commentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get comments - public
router.get("/post/:postId", getComments);

// Add comment - protected
router.post("/post/:postId", authMiddleware, addComment);

// Delete own comment - protected
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;