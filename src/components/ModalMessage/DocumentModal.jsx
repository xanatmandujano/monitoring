import React from "react";
import Modal from "react-bootstrap/Modal";

const DocumentModal = ({ ...props }) => {
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-message"
      data-bs-theme="dark"
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

export default DocumentModal;
