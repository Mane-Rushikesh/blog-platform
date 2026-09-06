import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/posts`;

// GET ALL POSTS
export const getPosts = async () => {
    const response = await axios.get(API_URL);

    return response.data;
};

// GET SINGLE POST
export const getPostById = async (id) => {
    const response = await axios.get(
        `${API_URL}/${id}`
    );

    return response.data;
};

// CREATE POST
export const createPost = async (
    postData,
    token
) => {
    const response = await axios.post(
        API_URL,
        postData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// UPDATE POST
export const updatePost = async (
    id,
    postData,
    token
) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        postData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// DELETE POST
export const deletePost = async (
    id,
    token
) => {
    const response = await axios.delete(
        `${API_URL}/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};