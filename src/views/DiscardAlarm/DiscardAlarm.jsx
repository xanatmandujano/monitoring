import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DiscardAlarmForm from "./DiscardAlarmForm";

const DiscardAlarm = ({ ...props }) => {
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
          Descartar alarma
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DiscardAlarmForm />
      </Modal.Body>
    </Modal>
  );
};

export default DiscardAlarm;
