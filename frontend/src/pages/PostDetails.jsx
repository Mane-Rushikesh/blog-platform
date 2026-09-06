import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    ArrowLeft,
    Send,
    Pencil,
    Trash2,
    Calendar,
    User
} from "lucide-react";

import Navbar from "../components/Navbar";
import Comment from "../components/Comment";

import {
    getPostById,
    updatePost,
    deletePost
} from "../services/postService";

import {
    getComments,
    addComment,
    deleteComment
} from "../services/commentService";

import { useAuth } from "../context/AuthContext";

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    const [commentText, setCommentText] = useState("");

    const [editing, setEditing] = useState(false);

    const [editData, setEditData] = useState({
        title: "",
        content: ""
    });

    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] =
        useState(false);
    const [editLoading, setEditLoading] =
        useState(false);

    const [error, setError] = useState("");

    // LOAD POST + COMMENTS
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [postData, commentData] =
                    await Promise.all([
                        getPostById(id),
                        getComments(id)
                    ]);

                setPost(postData.post);
                setComments(commentData.comments || []);

                setEditData({
                    title: postData.post.title,
                    content: postData.post.content
                });

            } catch (error) {
                console.error(
                    "Post Details Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load post"
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    // CHECK POST OWNER
    const isOwner =
        user &&
        post &&
        Number(user.id) === Number(post.author_id);

    // UPDATE POST
    const handleUpdatePost = async (e) => {
        e.preventDefault();

        if (
            !editData.title.trim() ||
            !editData.content.trim()
        ) {
            setError(
                "Title and content are required"
            );
            return;
        }

        try {
            setEditLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            await updatePost(
                id,
                {
                    title: editData.title.trim(),
                    content: editData.content.trim()
                },
                token
            );

            const data =
                await getPostById(id);

            setPost(data.post);

            setEditData({
                title: data.post.title,
                content: data.post.content
            });

            setEditing(false);

        } catch (error) {
            console.error(
                "Update Post Error:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to update post"
            );
        } finally {
            setEditLoading(false);
        }
    };

    // DELETE POST
    const handleDeletePost = async () => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this post?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            await deletePost(id, token);

            navigate("/");

        } catch (error) {
            console.error(
                "Delete Post Error:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to delete post"
            );
        }
    };

    // ADD COMMENT
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            return;
        }

        try {
            setCommentLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            await addComment(
                id,
                commentText.trim(),
                token
            );

            setCommentText("");

            const data =
                await getComments(id);

            setComments(
                data.comments || []
            );

        } catch (error) {
            console.error(
                "Add Comment Error:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to add comment"
            );
        } finally {
            setCommentLoading(false);
        }
    };

    // DELETE COMMENT
    const handleDeleteComment = async (
        commentId
    ) => {
        try {
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            await deleteComment(
                commentId,
                token
            );

            setComments(
                (previousComments) =>
                    previousComments.filter(
                        (comment) =>
                            comment.id !== commentId
                    )
            );

        } catch (error) {
            console.error(
                "Delete Comment Error:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to delete comment"
            );
        }
    };

    // LOADING
    if (loading) {
        return (
            <>
                <Navbar />

                <main className="details-container">
                    <div className="status-message">
                        <div className="loading-spinner"></div>
                        <p>Loading post...</p>
                    </div>
                </main>
            </>
        );
    }

    // POST NOT FOUND / ERROR
    if (!post) {
        return (
            <>
                <Navbar />

                <main className="details-container">

                    <div className="error-message">
                        {error ||
                            "Post not found"}
                    </div>

                    <button
                        className="back-btn"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </button>

                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="details-container">

                {/* BACK */}
                <Link
                    to="/"
                    className="back-link"
                >
                    <ArrowLeft size={18} />
                    Back to Posts
                </Link>

                {/* ERROR */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* POST */}
                <article className="post-details">

                    {editing ? (

                        /* EDIT MODE */
                        <form
                            className="edit-post-form"
                            onSubmit={
                                handleUpdatePost
                            }
                        >
                            <h1>Edit Post</h1>

                            <label htmlFor="edit-title">
                                Title
                            </label>

                            <input
                                id="edit-title"
                                type="text"
                                value={
                                    editData.title
                                }
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        title:
                                            e.target
                                                .value
                                    })
                                }
                                maxLength="255"
                                required
                            />

                            <label htmlFor="edit-content">
                                Content
                            </label>

                            <textarea
                                id="edit-content"
                                rows="12"
                                value={
                                    editData.content
                                }
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        content:
                                            e.target
                                                .value
                                    })
                                }
                                required
                            />

                            <div className="edit-actions">

                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={
                                        editLoading
                                    }
                                >
                                    {editLoading
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setEditing(
                                            false
                                        );

                                        setEditData({
                                            title:
                                                post.title,
                                            content:
                                                post.content
                                        });

                                        setError("");
                                    }}
                                    disabled={
                                        editLoading
                                    }
                                >
                                    Cancel
                                </button>

                            </div>
                        </form>

                    ) : (

                        /* VIEW MODE */
                        <>
                            <div className="post-title-row">

                                <h1>
                                    {post.title}
                                </h1>

                                {isOwner && (
                                    <div className="post-actions">

                                        <button
                                            className="edit-btn"
                                            onClick={() => {
                                                setEditing(
                                                    true
                                                );
                                                setError("");
                                            }}
                                        >
                                            <Pencil
                                                size={17}
                                            />
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={
                                                handleDeletePost
                                            }
                                        >
                                            <Trash2
                                                size={17}
                                            />
                                            Delete
                                        </button>

                                    </div>
                                )}

                            </div>

                            <div className="post-details-meta">

                                <span>
                                    <User size={16} />
                                    By{" "}
                                    {
                                        post.author_name
                                    }
                                </span>

                                <span>
                                    <Calendar
                                        size={16}
                                    />
                                    {new Date(
                                        post.created_at
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>

                            </div>

                            <div className="post-content">
                                {post.content}
                            </div>

                        </>
                    )}

                </article>

                {/* COMMENTS */}
                <section className="comments-section">

                    <div className="comments-heading">

                        <h2>
                            Comments (
                            {comments.length}
                            )
                        </h2>

                    </div>

                    {/* ADD COMMENT */}
                    {user ? (

                        <form
                            className="comment-form"
                            onSubmit={
                                handleCommentSubmit
                            }
                        >

                            <textarea
                                placeholder="Write a comment..."
                                value={
                                    commentText
                                }
                                onChange={(e) =>
                                    setCommentText(
                                        e.target.value
                                    )
                                }
                                rows="4"
                                maxLength="1000"
                                required
                            />

                            <div className="comment-form-footer">

                                <span>
                                    {
                                        commentText.length
                                    } / 1000
                                </span>

                                <button
                                    type="submit"
                                    disabled={
                                        commentLoading ||
                                        !commentText.trim()
                                    }
                                >
                                    <Send
                                        size={17}
                                    />

                                    {commentLoading
                                        ? "Posting..."
                                        : "Add Comment"}
                                </button>

                            </div>

                        </form>

                    ) : (

                        /* LOGIN MESSAGE */
                        <div className="login-comment">

                            <p>
                                Please login to
                                leave a comment.
                            </p>

                            <Link to="/login">
                                Login
                            </Link>

                        </div>
                    )}

                    {/* COMMENTS LIST */}
                    <div className="comments-list">

                        {comments.length === 0 ? (

                            <div className="no-comments">

                                <p>
                                    No comments yet.
                                </p>

                                <span>
                                    Be the first to
                                    comment!
                                </span>

                            </div>

                        ) : (

                            comments.map(
                                (comment) => (
                                    <Comment
                                        key={
                                            comment.id
                                        }
                                        comment={
                                            comment
                                        }
                                        onDelete={
                                            handleDeleteComment
                                        }
                                    />
                                )
                            )
                        )}

                    </div>

                </section>

            </main>
        </>
    );
};

export default PostDetails;