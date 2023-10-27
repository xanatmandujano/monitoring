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
import IdleAlarm from "../../components/AlarmDetails/IdleAlarm";
import NewAlarm from "./NewAlarm";

const AlarmsPanel = () => {
  const dispatch = useDispatch();
  const { alarms, alarmsCount } = useSelector((state) => state.alarms);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <>
      {/* <NewAlarm /> */}
      <Container fluid className="alarms-panel">
        <Row>
          <Col sm={2} style={{ paddingRight: "0" }}>
            <code>{alarmsCount}</code>
            <AlarmsSidebar />
          </Col>
          <Col sm={10}>
            {alarms && alarms.length >= 1 ? <Outlet /> : <IdleAlarm />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AlarmsPanel;
