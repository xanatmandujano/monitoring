import React, { useEffect } from "react";
//Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
//Components
import AlarmCard from "../../components/AlarmCard/AlarmCard";
import AlarmsSidebar from "../AlarmsSidebar/AlarmsSidebar";
import { getTodayAlarms } from "../../services/alarmsService";

const AlarmsPanel = () => {
  useEffect(() => {
    getTodayAlarms();
  }, []);

  return (
    <Container fluid className="alarms-panel">
      <Row>
        <Col sm={4}>
          <div className="alarms-side-bar">
            <AlarmsSidebar />
          </div>
        </Col>
        <Col sm={8}>Alarm details</Col>
      </Row>
    </Container>
  );
};

export default AlarmsPanel;
