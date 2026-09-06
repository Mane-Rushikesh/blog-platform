import { Trash2, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Comment = ({ comment, onDelete }) => {
    const { user } = useAuth();

    const canDelete =
        user && user.id === comment.user_id;

    const formattedDate = new Date(
        comment.created_at
    ).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <div className="comment">

            <div className="comment-header">

                <div className="comment-user">
                    <div className="comment-avatar">
                        <User size={16} />
                    </div>

                    <strong>
                        {comment.user_name}
                    </strong>
                </div>

                {canDelete && (
                    <button
                        className="delete-comment-btn"
                        onClick={() =>
                            onDelete(comment.id)
                        }
                        title="Delete comment"
                    >
                        <Trash2 size={16} />
                    </button>
                )}

            </div>

            <p className="comment-content">
                {comment.content}
            </p>

            <small>
                {formattedDate}
            </small>

        </div>
    );
};

export default Comment;