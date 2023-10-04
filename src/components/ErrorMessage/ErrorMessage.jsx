import React from "react";
import Modal from "react-bootstrap/Modal";

const ErrorMessage = ({ ...props }) => {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>{props.headermessage}</Modal.Title>
        <Modal.Body>{props.message}</Modal.Body>
      </Modal.Header>
    </Modal>
  );
};

export default ErrorMessage;
