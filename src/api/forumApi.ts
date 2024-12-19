import axios from 'axios';
import { getToken } from '../utils/handlingDataLogin';

const API_URL = 'https://api-genfiit.yanginibeda.web.id/api/forums';

export const fetchPosts = async (userId: number | null, showMyPosts: boolean) => {
  try {
    const token = await getToken();
    let url = `${API_URL}?populate=*`;
    if (showMyPosts && userId) {
      url += `&filters[users_permissions_user][id][$eq]=${userId}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Error fetching posts: ' + error);
  }
};

export const addPost = async (title: string, comment: string, userId: number) => {
  try {
    const token = await getToken();
    const newPost = {
      data: {
        title,
        comment,
        users_permissions_user: userId,
      },
    };
    const response = await axios.post(API_URL, newPost, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Error adding post: ' + error);
  }
};

export const deletePost = async (postId: number) => {
  try {
    const token = await getToken();
    await axios.delete(`${API_URL}/${postId}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error('Error deleting post: ' + error);
  }
};

export const editPost = async (postId: number, title: string, comment: string) => {
  try {
    const token = await getToken();
    const updatedPost = {
      data: {
        title,
        comment,
      },
    };

    await axios.put(`${API_URL}/${postId}`, updatedPost, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error('Error editing post: ' + error);
  }
};

export const fetchPostById = async (postId: number) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/${postId}?populate=*`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error('Error fetching post by ID: ' + error);
    }
  };