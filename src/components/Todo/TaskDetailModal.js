import React from "react";
import PropTypes from "prop-types";
import "../../styles/css/TaskDetail.css";

const TaskDetailModal = ({ isOpen, onClose, task, onDelete }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Task Title</p>
        <h2>{task.name}</h2>
        <p>Task Description</p>
        <h2>{task.description}</h2>
        <button className="button-delete" onClick={onDelete}>
          Delete
        </button>
        <button className="button-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

TaskDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
};

export default TaskDetailModal;
