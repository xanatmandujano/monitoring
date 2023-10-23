import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
//Icons
import { FaBell } from "react-icons/fa";

const AlarmCard = ({ ...props }) => {
  return (
    <Card className="alarm-card">
      <Card.Body>
        <Card.Title>
          {/* <FaBell className="bell-icon" />{" "} */}
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
          Hora: {props.creationDate}
        </Card.Text>
        <div className="btn-alarm">
          <Link to={`${props.alarmParams}`}>
            <Button variant="main">Ver</Button>
          </Link>
          {/* <Button variant="main">Descartar</Button> */}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AlarmCard;
