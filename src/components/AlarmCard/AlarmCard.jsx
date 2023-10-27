import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

const AlarmCard = ({ ...props }) => {
  const dateTime = (creationDate) => {
    const alarmDateTime = new Date(creationDate);
    const alarmTime = alarmDateTime.toLocaleTimeString("es-MX");
    return alarmTime;
  };

  return (
    <Card className="alarm-card">
      <Card.Body>
        <Card.Title>
          <img
            src={`data:image/png;base64,${props.alarmIcon}`}
            width="20px"
            height="20px"
          />
          {`${props.alarmCode} - ${props.alarmDescription}`}
        </Card.Title>
        <Card.Text>
          {`${props.locationInfo}`}
          <br />
          Dispositivo: {props.deviceCodeIPAddress} <br />
          Hora: {dateTime(props.creationDate)}
        </Card.Text>
        <div className="btn-alarm">
          <Link to={`${props.alarmParams}`}>
            <Button variant="main" size="md">
              Ver
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AlarmCard;
