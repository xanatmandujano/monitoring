import React from "react";
import Modal from "react-bootstrap/Modal";
import AcceptFRForm from "./AcceptFRForm";

const AcceptAlarmFR = ({ ...props }) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-message"
      data-bs-theme="dark"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Validar alarma
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AcceptFRForm onHide={props.onHide} />
      </Modal.Body>
    </Modal>
  );
};

export default AcceptAlarmFR;
