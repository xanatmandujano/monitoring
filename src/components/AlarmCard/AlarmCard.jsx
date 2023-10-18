import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
//Icons
import { FaBell } from "react-icons/fa";

const AlarmCard = ({ ...props }) => {
  return (
    <Card className="alarm-card">
      <Card.Body>
        <Card.Title>
          <FaBell className="bell-icon" />{" "}
          {`${props.alarmCode} - ${props.alarmDescription}`}
        </Card.Title>
        <Card.Text>
          {`${props.locationInfo}`}
          <br />
          Dispositivo: {props.deviceCodeIPAddress} <br />
          Hora: {props.creationDate}
        </Card.Text>
        <div className="btn-alarm">
          <Button variant="main">Ver</Button>
          {/* <Button variant="main">Descartar</Button> */}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AlarmCard;
