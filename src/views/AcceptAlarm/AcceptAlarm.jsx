import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
//Components
import AcceptAlarmForm from "./AcceptAlarmForm";

const AcceptAlarm = ({ ...props }) => {
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
        <AcceptAlarmForm onHide={props.onHide} />
      </Modal.Body>
    </Modal>
  );
};

export default AcceptAlarm;
