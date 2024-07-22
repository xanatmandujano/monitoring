import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const CanceledAlarm = ({ ...props }) => {
  return (
    <ToastContainer position="top-center">
      <Toast
        show={props.toastShow}
        autohide
        delay={10000}
        onClose={props.hideToast}
        //key={"Danger"}
        bg={"warning"}
        //data-bs-theme="dark"
      >
        <Toast.Header>
          <strong className="me-auto">Cancelado</strong>
          <small>Ahora</small>
        </Toast.Header>
        <Toast.Body style={{ color: "black" }}>
          El envío de a alarma fue cancelado
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CanceledAlarm;
