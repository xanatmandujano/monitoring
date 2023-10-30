import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const AcceptAlarm = ({ ...props }) => {
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
      <Modal.Body>
        <Form.Group>
          <Form.Label>{props.label}</Form.Label>
          <Form.Control as="textarea" />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="main" onClick={props.btnaction}>
          {props.btntext}
        </Button>
        <Button variant="main" onClick={props.btncancel}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AcceptAlarm;
