import React from "react";
//Bootstrap
import Container from "react-bootstrap/Container";
//Image
import error from "/assets/images/error-404.png";

const ErrorPage = () => {
  return (
    <Container className="unauthorized-page">
      <img src={error} alt="404 screen" width={100} />
      <p>
        Lo sentimos, el sitio no está disponible. Actualiza o verifica la URL
      </p>
    </Container>
  );
};

export default ErrorPage;
