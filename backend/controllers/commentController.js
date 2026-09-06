const db = require("../config/db");

// ADD COMMENT
const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        // Check post exists
        const [posts] = await db.query(
            "SELECT id FROM posts WHERE id = ?",
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const [result] = await db.query(
            "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
            [postId, req.user.id, content]
        );

        res.status(201).json({
            message: "Comment added successfully",
            commentId: result.insertId
        });

    } catch (error) {
        console.error("Add Comment Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET COMMENTS
const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const [comments] = await db.query(`
            SELECT
                comments.id,
                comments.content,
                comments.created_at,
                users.id AS user_id,
                users.name AS user_name
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = ?
            ORDER BY comments.created_at DESC
        `, [postId]);

        res.json({
            comments
        });

    } catch (error) {
        console.error("Get Comments Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE COMMENT
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const [comments] = await db.query(
            "SELECT user_id FROM comments WHERE id = ?",
            [id]
        );

        if (comments.length === 0) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comments[0].user_id !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own comments"
            });
        }

        await db.query(
            "DELETE FROM comments WHERE id = ?",
            [id]
        );

        res.json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("Delete Comment Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    addComment,
    getComments,
    deleteComment
};