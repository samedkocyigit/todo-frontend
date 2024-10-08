import React, { useState } from "react";
import { useUserContext } from "../../store/UserContext";
import "../../styles/css/CreateTask.css";
import { createTask, fetchTasks } from "../../services/taskService";

const CreateTask = ({ onCreate, onClose }) => {
  const { user, setTasks } = useUserContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name && description) {
      try {
        await createTask({
          name,
          description,
          userId: user.userId,
        });
        const updatedTasks = await fetchTasks(user.userId);
        const transformedTasks = updatedTasks.map((task) => ({
          id: task.id,
          name: task.name,
          description: task.description,
          state:
            task.state === 0
              ? "TASK"
              : task.state === 1
              ? "IN_PROGRESS"
              : "COMPLETED",
        }));
        setTasks(transformedTasks);
        setName("");
        setDescription("");
        onClose();
      } catch (error) {
        console.error("An error occured during create task:", error);
      }
    }
  };

  return (
    <div className="modal">
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label className="label">Name:</label>
          <input
            className="input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Description:</label>
          <input
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button className="button" type="submit">
          Create
        </button>
        <button className="button" type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
