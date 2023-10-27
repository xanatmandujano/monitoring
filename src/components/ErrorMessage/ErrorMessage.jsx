import React from "react";
import Modal from "react-bootstrap/Modal";

const ErrorMessage = ({ ...props }) => {
  return (
    <Modal {...props} size="sm" data-bs-theme="dark" className="modal-message">
      <Modal.Header data-bs-theme="dark" closeButton>
        <Modal.Title data-bs-theme="dark">{props.headermessage}</Modal.Title>
      </Modal.Header>
      <Modal.Body data-bs-theme="dark">{props.message}</Modal.Body>
    </Modal>
  );
};

export default ErrorMessage;
