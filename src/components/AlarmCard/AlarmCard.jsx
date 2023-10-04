import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
//Icons
import { FaBell } from "react-icons/fa";

const AlarmCard = () => {
  return (
    <Card className="alarm-card">
      <Card.Body>
        <Card.Title>
          <FaBell className="bell-icon" /> Alarm type
        </Card.Title>
        <Card.Text>
          15038 - Sucursal Banbajio, CMX, MEX <br />
          Dispositivio: ... <br />
          Hora: 11:19
        </Card.Text>
        <div className="btn-alarm">
          <Button variant="main">Ver</Button>
          <Button variant="main">Descartar</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AlarmCard;
