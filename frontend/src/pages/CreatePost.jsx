import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Send,
    FileText
} from "lucide-react";

import Navbar from "../components/Navbar";
import { createPost } from "../services/postService";

const CreatePost = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        content: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !formData.title.trim() ||
            !formData.content.trim()
        ) {
            setError(
                "Title and content are required"
            );
            return;
        }

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            await createPost(
                {
                    title: formData.title.trim(),
                    content: formData.content.trim()
                },
                token
            );

            navigate("/");

        } catch (error) {
            console.error(
                "Create Post Error:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to create post"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="create-container">

                <div className="create-card">

                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </button>

                    <div className="create-heading">

                        <div className="create-icon">
                            <FileText size={25} />
                        </div>

                        <div>
                            <h1>Create New Post</h1>

                            <p>
                                Share your thoughts with
                                the community.
                            </p>
                        </div>

                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form
                        className="create-post-form"
                        onSubmit={handleSubmit}
                    >

                        <label htmlFor="title">
                            Post Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Enter an interesting title..."
                            value={formData.title}
                            onChange={handleChange}
                            maxLength="255"
                            required
                        />

                        <div className="content-label-row">
                            <label htmlFor="content">
                                Content
                            </label>

                            <span>
                                {formData.content.length} characters
                            </span>
                        </div>

                        <textarea
                            id="content"
                            name="content"
                            placeholder="Write your blog post here..."
                            value={formData.content}
                            onChange={handleChange}
                            rows="12"
                            required
                        />

                        <div className="create-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() =>
                                    navigate("/")
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="publish-btn"
                                disabled={loading}
                            >
                                <Send size={18} />

                                {loading
                                    ? "Publishing..."
                                    : "Publish Post"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>
        </>
    );
};

export default CreatePost;