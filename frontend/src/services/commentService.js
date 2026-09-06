import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/comments`;

// GET COMMENTS
export const getComments = async (postId) => {
    const response = await axios.get(
        `${API_URL}/post/${postId}`
    );

    return response.data;
};

// ADD COMMENT
export const addComment = async (
    postId,
    content,
    token
) => {
    const response = await axios.post(
        `${API_URL}/post/${postId}`,
        {
            content
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// DELETE COMMENT
export const deleteComment = async (
    commentId,
    token
) => {
    const response = await axios.delete(
        `${API_URL}/${commentId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};