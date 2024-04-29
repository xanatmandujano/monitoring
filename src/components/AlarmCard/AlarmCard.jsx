import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const AlarmCard = ({ ...props }) => {
  const dateTime = (creationDate) => {
    const alarmDateTime = new Date(creationDate);
    const alarmTime = alarmDateTime.toLocaleTimeString("es-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return alarmTime;
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
            onClick={props.onClick}
            //disabled={props.disabled}
          >
            Ver
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AlarmCard;
