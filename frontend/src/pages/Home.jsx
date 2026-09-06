import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    PenLine,
    BookOpen
} from "lucide-react";

import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

import { getPosts } from "../services/postService";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user } = useAuth();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPosts();

                setPosts(data.posts || []);
            } catch (error) {
                console.error(
                    "Get Posts Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load posts"
                );
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    return (
        <>
            <Navbar />

            <main className="home-container">

                {/* HERO SECTION */}
                <section className="hero">

                    <div className="hero-content">

                        <div className="hero-icon">
                            <BookOpen size={30} />
                        </div>

                        <h1>
                            Welcome to BlogPlatform
                        </h1>

                        <p>
                            Discover interesting stories,
                            share your thoughts and connect
                            with other writers.
                        </p>

                        {user && (
                            <Link
                                to="/create-post"
                                className="hero-create-btn"
                            >
                                <PenLine size={19} />
                                Write a Post
                            </Link>
                        )}

                    </div>

                </section>

                {/* POSTS SECTION */}
                <section className="posts-section">

                    <div className="section-heading">

                        <div>
                            <h2>Latest Posts</h2>

                            <p>
                                Explore the latest stories
                                from our community.
                            </p>
                        </div>

                        {user && (
                            <Link
                                to="/create-post"
                                className="section-create-btn"
                            >
                                <Plus size={18} />
                                New Post
                            </Link>
                        )}

                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="status-message">
                            <div className="loading-spinner"></div>
                            <p>Loading posts...</p>
                        </div>
                    )}

                    {/* ERROR */}
                    {!loading && error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!loading &&
                        !error &&
                        posts.length === 0 && (
                            <div className="empty-posts">

                                <div className="empty-icon">
                                    <BookOpen size={30} />
                                </div>

                                <h3>
                                    No posts yet
                                </h3>

                                <p>
                                    Be the first person to
                                    publish a blog post.
                                </p>

                                {user && (
                                    <Link
                                        to="/create-post"
                                        className="create-btn"
                                    >
                                        <PenLine size={17} />
                                        Create First Post
                                    </Link>
                                )}

                            </div>
                        )}

                    {/* POSTS */}
                    {!loading &&
                        !error &&
                        posts.length > 0 && (
                            <div className="posts-grid">
                                {posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                    />
                                ))}
                            </div>
                        )}

                </section>

            </main>
        </>
    );
};

export default Home;