import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
//React-router-dom
import { Link } from "react-router-dom";

const AlarmHistoryData = ({ ...props }) => {
  const dateTime = (creationDate) => {
    const alarmDateTime = new Date(creationDate);
    const alarmTime = alarmDateTime.toLocaleDateString("es-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return alarmTime;
  };

  return (
    <Container className="alarm-history-card">
      <Card bg="secondary">
        <Card.Body>
          <Card.Text>{props.alarmDescription}</Card.Text>
          <Card.Text>{props.branchCode}</Card.Text>
          <Card.Text>{dateTime(props.creationDate)}</Card.Text>
          <Card.Text>{props.alarmStatus}</Card.Text>
          <Link to={`${props.alarmParams}`}>
            <Button variant="main" size="md">
              {props.btnText}
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AlarmHistoryData;
