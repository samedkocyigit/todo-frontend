import React, { useState, useEffect } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskCard from "../components/Todo/TaskCard";
import CreateTask from "../components/Todo/CreateTask";
import Modal from "../components/Todo/Modal";
import TaskDetailModal from "../components/Todo/TaskDetailModal";
import "../styles/css/Home.css";
import { useNavigate } from "react-router-dom";
import { fetchTasks, updateTask, deleteTask } from "../services/taskService";
import { useUserContext } from "../store/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser, setTasks, tasks } = useUserContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      if (!user.userId) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.userId) {
          await setUser(storedUser);
        } else {
          navigate("/auth/login");
          return;
        }
      }

      try {
        const fetchedTasks = await fetchTasks(user.userId);
        const transformedTasks = fetchedTasks.map((task) => ({
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
      } catch (error) {
        console.error("An Error Occured during load task process:", error);
      }
    };

    loadTasks();
  }, [user, setUser, navigate, setTasks]);

  const moveTask = async (taskId, newState) => {
    const apiState =
      newState === "TASK" ? 0 : newState === "IN_PROGRESS" ? 1 : 2;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, state: newState } : task
      )
    );

    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      const updateTaskDto = {
        id: taskId,
        name: taskToUpdate.name,
        description: taskToUpdate.description,
        userId: user.userId,
        state: apiState,
      };

      await updateTask(taskId, updateTaskDto);
    } catch (error) {
      console.error("An error occurred during the update process", error);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, state: prevTasks.find((t) => t.id === taskId).state }
            : task
        )
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const handleTaskDetailClick = (task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(selectedTask.id);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== selectedTask.id)
      );
      setDetailModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("An error occured during delete process:", error);
    }
  };

  const Column = ({ state, title, onCreate }) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      accept: "TASK",
      drop: (item) => moveTask(item.id, state),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }));

    return (
      <div
        ref={drop}
        className={`column ${isOver && canDrop ? "highlight" : ""}`}
      >
        <h3>{title}</h3>
        {tasks
          .filter((task) => task.state === state)
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDetailClick={() => handleTaskDetailClick(task)}
            />
          ))}
        {state === "TASK" && (
          <button className="create-task-button" onClick={() => onCreate()}>
            Create Task
          </button>
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="home-container">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
        <div className="columns">
          <Column
            state="TASK"
            title="Tasks"
            onCreate={() => setModalOpen(true)}
          />
          <Column state="IN_PROGRESS" title="In Progress" />
          <Column state="COMPLETED" title="Completed" />
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <CreateTask onClose={() => setModalOpen(false)} />
        </Modal>
        <TaskDetailModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          task={selectedTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </DndProvider>
  );
};

export default Home;
