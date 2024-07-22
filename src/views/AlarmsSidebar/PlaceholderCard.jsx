import React from "react";
//Bootstrap
import Placeholder from "react-bootstrap/Placeholder";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import AlarmCard from "../../components/AlarmCard/AlarmCard";

const PlaceholderCard = () => {
  return (
    <Card className={"alarm-card intermitent"}>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder md={7} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder md={6} />
          <Placeholder md={6} />
          <Placeholder md={6} />
          <Placeholder md={6} />
          <Placeholder md={6} />
        </Placeholder>
        <Placeholder.Button variant="main" md={12} />
      </Card.Body>
    </Card>
  );
};

export default PlaceholderCard;
