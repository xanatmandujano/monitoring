import React from "react";
import { BsFillBellSlashFill } from "react-icons/bs";
//Boostrap
import Container from "react-bootstrap/Container";

const IdleAlarm = () => {
  return (
    <Container className="idle-alarm">
      <BsFillBellSlashFill className="bell-idle-alarm" />
      <p>Ninguna alarma seleccionada</p>
    </Container>
  );
};

export default IdleAlarm;
