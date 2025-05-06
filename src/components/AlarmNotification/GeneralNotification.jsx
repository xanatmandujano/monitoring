import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const GeneralNotification = ({ ...props }) => {
  return (
    <ToastContainer position="top-center">
      <Toast
        show={props.toastShow}
        autohide
        delay={10000}
        onClose={props.hideToast}
        key={"Warning"}
        bg={"warning"}
        data-bs-theme="dark"
      >
        <Toast.Header>
          {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" /> */}
          <strong className="me-auto">{props.header}</strong>
          <small>Ahora</small>
        </Toast.Header>
        <Toast.Body>{props.data}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default GeneralNotification;
