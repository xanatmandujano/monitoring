import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useParams, useNavigate } from "react-router-dom";
import { sendMessage } from "../../store/actions/notificationActions";
import { releaseAlarm } from "../../store/actions/alarmsActions";
import { useDispatch, useSelector } from "react-redux";

const AlarmCard = ({ ...props }) => {
  const dateTime = (creationDate) => {
    const alarmDateTime = new Date(creationDate);
    const alarmTime = alarmDateTime.toLocaleTimeString("es-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return alarmTime;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { idVideo } = useParams();
  const { userId } = useSelector((state) => state.persist.authState.authInfo);

  //Send message
  const sendAlarmStatus = async (action, alarmId) => {
    const chatMessage = {
      user: userId,
      message: JSON.stringify({
        action: action,
        alarmId: alarmId,
      }),
    };

    dispatch(sendMessage({ send: "SendToOthers", message: chatMessage }))
      .unwrap()
      .then(() => {
        console.log("Message sent");
      });
  };

  const closeAlarm = (alarmId) => {
    dispatch(
      releaseAlarm({
        alarmId: idVideo && idVideo,
      })
    )
      .unwrap()
      .then(() => {
        //sendAlarmStatus("release", idVideo);
        sendAlarmStatus("view", alarmId);
        navigate(`seproban/${alarmId}`);
      });
  };

  return (
    <Card
      className={`alarm-card ${props.classN}`}
      style={props.display}
      id={props.activeId}
    >
      <Card.Body>
        <Card.Title>
          <img src={props.alarmIcon} width="20px" height="20px" />
          {`${props.alarmCode} - ${props.alarmDescription}`}
        </Card.Title>
        <Card.Text>
          {`${props.locationInfo}`}
          <br />
          Dispositivo: {props.deviceCode} <br />
          Dirección IP: {props.deviceIPAddress} <br />
          Hora: {dateTime(props.creationDate)}
        </Card.Text>
        <div className="btn-alarm">
          <Button
            variant="main"
            size="md"
            className="card-btn"
            onClick={() => closeAlarm(props.activeId)}
            disabled={props.disabled}
          >
            Ver
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AlarmCard;
