const db = require("../config/db");

// CREATE POST
const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const [result] = await db.query(
            "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)",
            [req.user.id, title, content]
        );

        res.status(201).json({
            message: "Post created successfully",
            postId: result.insertId
        });

    } catch (error) {
        console.error("Create Post Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL POSTS
const getPosts = async (req, res) => {
    try {
        const [posts] = await db.query(`
            SELECT 
                posts.id,
                posts.title,
                posts.content,
                posts.created_at,
                posts.updated_at,
                users.id AS author_id,
                users.name AS author_name
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC
        `);

        res.json({
            posts
        });

    } catch (error) {
        console.error("Get Posts Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET SINGLE POST
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const [posts] = await db.query(`
            SELECT 
                posts.id,
                posts.title,
                posts.content,
                posts.created_at,
                posts.updated_at,
                users.id AS author_id,
                users.name AS author_name
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = ?
        `, [id]);

        if (posts.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.json({
            post: posts[0]
        });

    } catch (error) {
        console.error("Get Post Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE POST
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const [posts] = await db.query(
            "SELECT user_id FROM posts WHERE id = ?",
            [id]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (posts[0].user_id !== req.user.id) {
            return res.status(403).json({
                message: "You can only edit your own posts"
            });
        }

        await db.query(
            "UPDATE posts SET title = ?, content = ? WHERE id = ?",
            [title, content, id]
        );

        res.json({
            message: "Post updated successfully"
        });

    } catch (error) {
        console.error("Update Post Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE POST
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const [posts] = await db.query(
            "SELECT user_id FROM posts WHERE id = ?",
            [id]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (posts[0].user_id !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own posts"
            });
        }

        await db.query(
            "DELETE FROM posts WHERE id = ?",
            [id]
        );

        res.json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error("Delete Post Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
};