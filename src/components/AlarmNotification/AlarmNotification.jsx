import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const AlarmNotification = ({ ...props }) => {
  return (
    <ToastContainer position="top-center">
      <Toast
        show={props.toastShow}
        autohide
        delay={5000}
        onClose={props.hideToast}
        key={"Danger"}
        bg={"danger"}
        data-bs-theme="dark"
      >
        <Toast.Header>
          {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" /> */}
          <strong className="me-auto">Nueva alarma</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>{props.alarmData}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default AlarmNotification;
