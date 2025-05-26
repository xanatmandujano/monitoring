import React from "react";
//Components
import LineChart from "./LineChart";
//Bootstrap
import Container from "react-bootstrap/Container";

const Dashboards = () => {
  return (
    <Container className="dashboards-container">
      <LineChart />
    </Container>
  );
};

export default Dashboards;
