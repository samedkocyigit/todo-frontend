import axios from "axios";

const API_URL = "http://localhost:5086/api";

export const login = async (credential) => {
  return await axios.post(`${API_URL}/auth/login`, credential);
};

export const register = async (userData) => {
  return await axios.post(`${API_URL}/auth/register`, userData);
};

export const logout = async () => {
  return await axios.get(`${API_URL}/auth/logout`);
};

export const updateTaskStatus = async (taskId, status) => {
  return await axios.put(`/api/tasks/${taskId}`, status);
};

export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data.$values;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
