import React, { useEffect } from "react";
import { clearMessage } from "../../store/slices/messageSlice";
import { useDispatch, useSelector } from "react-redux";
//React router dom
import { Outlet } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
//Components
import AlarmsSidebar from "../AlarmsSidebar/AlarmsSidebar";
import AlarmDetails from "../../components/AlarmDetails/AlarmDetails";
import IdleAlarm from "../../components/AlarmDetails/IdleAlarm";

const AlarmsPanel = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <Container fluid className="alarms-panel">
      <Row>
        <Col sm={3}>
          <AlarmsSidebar />
        </Col>
        <Col sm={9}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AlarmsPanel;
