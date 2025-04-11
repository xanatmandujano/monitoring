import React from "react";
//Bootstrap
import Container from "react-bootstrap/Container";
//Image
import lock from "/assets/images/lock-cross.png";

const UnauthorizedPage = () => {
  return (
    <Container className="unauthorized-page" fluid>
      <img src={lock} alt="lock crossed" width={100} />
      <p>No tienes acceso a esta información</p>
    </Container>
  );
};

export default UnauthorizedPage;
