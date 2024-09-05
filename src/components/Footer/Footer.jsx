import React from "react";
import Container from "react-bootstrap/Container";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

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
      <footer>Caelum Group - {year}</footer>
    </Container>
  );
};

export default Footer;
