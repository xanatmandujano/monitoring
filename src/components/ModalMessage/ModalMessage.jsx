import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ModalMessage = ({ ...props }) => {
  return (
    <Modal
      {...props}
      size="sm"
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
      <Modal.Footer className="btns-container">
        <Button variant="outline-light" onClick={props.onHide} size="sm">
          Cancelar
        </Button>
        <Button variant="main" onClick={props.btnaction} size="sm">
          {props.btntext}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalMessage;
