import React from "react";
//Redux
import { useDispatch } from "react-redux";
import { alarmStatus } from "../../store/actions/alarmsActions";
import { useSendMessageMutation } from "../../store/api/signalRApi";
//Router dom
import { useParams, useNavigate } from "react-router-dom";
//Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ReactivateAlarm = ({ ...props }) => {
  const dispatch = useDispatch();
  const [sendMessage] = useSendMessageMutation();
  const { idVideo } = useParams();
  const navigate = useNavigate();

  const sendAlarmStatus = async () => {
    const viewAction = {
      user: "",
      message: JSON.stringify({
        action: "reactivated",
        alarmId: idVideo,
      }),
    };

    await sendMessage(viewAction).unwrap();
  };

  const handleAlarmStatus = () => {
    sendAlarmStatus();
    dispatch(
      alarmStatus({
        alarmId: idVideo,
        statusId: 6,
        comments: "",
      })
    )
      .unwrap()
      .then(() => {
        navigate("/alarms-history");
        window.location.reload();
      });
  };

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-message"
      data-bs-theme="dark"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Reactivar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de reactivar esta alarma?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-light" onClick={props.onHide} size="sm">
          Cancelar
        </Button>
        <Button variant="main" onClick={handleAlarmStatus} size="sm">
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReactivateAlarm;
