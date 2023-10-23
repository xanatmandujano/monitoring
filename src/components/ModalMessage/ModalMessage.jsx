import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ModalMessage = ({ ...props }) => {
  // const handleClick = (e) => {
  //   e.stopPropagation();
  // };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.headermessage}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.message}</Modal.Body>
      <Modal.Footer>
        <Button variant="main" onClick={props.logout}>
          {props.btntext}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalMessage;
