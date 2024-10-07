import axios from "axios";

const API_URL = "http://localhost:5086/api";

export const fetchTasks = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/user/${id}`);
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}/${status}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const createTask = async (newTask) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, newTask);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/tasks/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
