import React from "react";
import { useDrag } from "react-dnd";

const TaskCard = ({ task, onDetailClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="task-card"
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ flexGrow: 1 }}>{task.name}</span>
        <i
          className="fas fa-info-circle"
          onClick={onDetailClick}
          style={{
            cursor: "pointer",
            marginLeft: "10px",
            color: "blue",
            fontSize: "1.2em",
          }}
          title="Details"
        ></i>
      </div>
    </div>
  );
};

export default TaskCard;
