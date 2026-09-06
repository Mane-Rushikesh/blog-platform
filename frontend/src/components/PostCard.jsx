import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";

const PostCard = ({ post }) => {
    const formattedDate = new Date(
        post.created_at
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return (
        <article className="post-card">

            <div className="post-card-content">

                <h2>{post.title}</h2>

                <div className="post-meta">

                    <span>
                        <User size={16} />
                        {post.author_name}
                    </span>

                    <span>
                        <Calendar size={16} />
                        {formattedDate}
                    </span>

                </div>

                <p>
                    {post.content.length > 180
                        ? `${post.content.substring(0, 180)}...`
                        : post.content}
                </p>

                <Link
                    to={`/posts/${post.id}`}
                    className="read-more"
                >
                    <span>Read More</span>
                    <ArrowRight size={17} />
                </Link>

            </div>

        </article>
    );
};

export default PostCard;