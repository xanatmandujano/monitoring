import React, { useEffect, useState } from "react";
//Redux
import { useDispatch } from "react-redux";
import { alarmStatus } from "../../store/actions/alarmsActions";
import { Connector } from "../../signalr/signalr-connection";
//Router dom
import { useParams, useNavigate, Link } from "react-router-dom";
//Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ReactivateAlarm = ({ ...props }) => {
  const dispatch = useDispatch();
  const { idVideo } = useParams();
  const navigate = useNavigate();

  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = Connector();
    setConnection(newConnection);
    newConnection.start();
  }, []);

  const sendAlarmStatus = async () => {
    const chatMessage = {
      user: "",
      message: JSON.stringify({
        action: "reactivated",
        alarmId: idVideo,
      }),
    };
    try {
      if (connection) {
        await connection.send("SendToOthers", chatMessage).then(() => {
          console.log("Alarm reactivated send");
        });
      }
    } catch (error) {
      console.log(error);
    }
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
        console.log("Alarma reactivada");
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
