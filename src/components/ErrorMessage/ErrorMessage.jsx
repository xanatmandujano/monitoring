import React from "react";
import Modal from "react-bootstrap/Modal";

const ErrorMessage = ({ ...props }) => {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.headermessage}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.message}</Modal.Body>
    </Modal>
  );
};

export default ErrorMessage;
