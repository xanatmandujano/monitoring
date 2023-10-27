import React from "react";
import Container from "react-bootstrap/Container";

const Footer = () => {
  return (
    <Container
      fluid
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: ".5rem",
        marginBottom: ".5rem",
      }}
    >
      <footer>Caelum Group - 2023</footer>
    </Container>
  );
};

export default Footer;
