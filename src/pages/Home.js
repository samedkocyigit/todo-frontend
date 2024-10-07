// import React, { useState, useEffect } from "react";
// import { DndProvider, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import TaskCard from "../components/Todo/TaskCard";
// import CreateTask from "../components/Todo/CreateTask";
// import Modal from "../components/Todo/Modal";
// import "../styles/css/Home.css";
// import { useNavigate } from "react-router-dom";
// import { fetchTasks, updateTaskStatus } from "../services/taskService";
// import { useUserContext } from "../store/UserContext";

// const Home = () => {
//   const navigate = useNavigate();
//   const { user, setUser, setTasks, tasks } = useUserContext();
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     const loadTasks = async () => {
//       try {
//         const fetchedTasks = await fetchTasks(user.userId);
//         console.log("fetched Tasks", fetchedTasks);
//         const transformedTasks = fetchedTasks.map((task) => ({
//           id: task.id,
//           name: task.name,
//           description: task.description,
//           state:
//             task.state === 0
//               ? "TASK"
//               : task.state === 1
//               ? "IN_PROGRESS"
//               : "COMPLETED",
//         }));
//         setTasks(transformedTasks);
//       } catch (error) {
//         console.error("Görevler yüklenirken bir hata oluştu:", error);
//       }
//     };

//     if (user.userId) {
//       loadTasks();
//     } else {
//       navigate("/auth/login");
//     }
//   }, [user.userId, navigate, setTasks]);

//   const moveTask = async (taskId, newState) => {
//     const apiState =
//       newState === "TASK"
//         ? "Task"
//         : newState === "IN_PROGRESS"
//         ? "InProgress"
//         : "Completed";

//     setTasks((prevTasks) =>
//       prevTasks.map((task) =>
//         task.id === taskId ? { ...task, state: newState } : task
//       )
//     );

//     try {
//       await updateTaskStatus(taskId, apiState);
//     } catch (error) {
//       console.error("Görev durumu güncellenirken bir hata oluştu:", error);
//       setTasks((prevTasks) =>
//         prevTasks.map((task) =>
//           task.id === taskId
//             ? { ...task, state: prevTasks.find((t) => t.id === taskId).state }
//             : task
//         )
//       );
//     }
//   };

//   const addTask = ({ name, description }) => {
//     const newTask = {
//       id: tasks.length + 1,
//       name: name,
//       description,
//       state: "TASK",
//     };
//     setTasks((prevTasks) => [...prevTasks, newTask]);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/auth/login");
//   };

//   const Column = ({ state, title, onCreate }) => {
//     const [{ canDrop, isOver }, drop] = useDrop(() => ({
//       accept: "TASK",
//       drop: (item) => moveTask(item.id, state),
//       collect: (monitor) => ({
//         isOver: !!monitor.isOver(),
//         canDrop: !!monitor.canDrop(),
//       }),
//     }));

//     return (
//       <div
//         ref={drop}
//         className={`column ${isOver && canDrop ? "highlight" : ""}`}
//       >
//         <h3>{title}</h3>
//         {tasks
//           .filter((task) => task.state === state)
//           .map((task) => (
//             <TaskCard key={task.id} task={task} />
//           ))}
//         {state === "TASK" && (
//           <button className="create-task-button" onClick={() => onCreate()}>
//             Create Task
//           </button>
//         )}
//       </div>
//     );
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="home-container">
//         <button onClick={handleLogout} className="logout-button">
//           Logout
//         </button>
//         <div className="columns">
//           <Column
//             state="TASK"
//             title="Tasks"
//             onCreate={() => setModalOpen(true)}
//           />
//           <Column state="IN_PROGRESS" title="In Progress" />
//           <Column state="COMPLETED" title="Completed" />
//         </div>
//         <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
//           <CreateTask onCreate={addTask} onClose={() => setModalOpen(false)} />
//         </Modal>
//       </div>
//     </DndProvider>
//   );
// };

// export default Home;

import React, { useState, useEffect } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskCard from "../components/Todo/TaskCard";
import CreateTask from "../components/Todo/CreateTask";
import Modal from "../components/Todo/Modal";
import TaskDetailModal from "../components/Todo/TaskDetailModal";
import "../styles/css/Home.css";
import { useNavigate } from "react-router-dom";
import {
  fetchTasks,
  updateTaskStatus,
  deleteTask,
} from "../services/taskService";
import { useUserContext } from "../store/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser, setTasks, tasks } = useUserContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
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
        console.error("Görevler yüklenirken bir hata oluştu:", error);
      }
    };

    if (user.userId) {
      loadTasks();
    } else {
      navigate("/auth/login");
    }
  }, [user.userId, navigate, setTasks]);

  const moveTask = async (taskId, newState) => {
    const apiState =
      newState === "TASK"
        ? "Task"
        : newState === "IN_PROGRESS"
        ? "InProgress"
        : "Completed";

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, state: newState } : task
      )
    );

    try {
      await updateTaskStatus(taskId, apiState);
    } catch (error) {
      console.error("Görev durumu güncellenirken bir hata oluştu:", error);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, state: prevTasks.find((t) => t.id === taskId).state }
            : task
        )
      );
    }
  };

  const addTask = ({ name, description }) => {
    const newTask = {
      id: tasks.length + 1,
      name: name,
      description,
      state: "TASK",
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
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
      console.error("Görev silinirken bir hata oluştu:", error);
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
              onDetailClick={() => handleTaskDetailClick(task)} // Info butonuna tıklama olayını buraya ekledik
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
          <CreateTask onCreate={addTask} onClose={() => setModalOpen(false)} />
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
