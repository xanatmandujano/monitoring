import React, { useEffect, useState } from "react";
import { clearMessage } from "../../store/slices/messageSlice";
import { useDispatch, useSelector } from "react-redux";
//React router dom
import { Outlet, useParams } from "react-router-dom";
import { Connector } from "../../signalr/signalr-connection";
//Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
//Components
import AlarmsSidebar from "../AlarmsSidebar/AlarmsSidebar";
import IdleAlarm from "../../components/AlarmDetails/IdleAlarm";
import NewAlarm from "./NewAlarm";
//import NewAlarmTest from "./NewAlarmTest";

const AlarmsPanel = () => {
  const { idVideo } = useParams();
  const { alarmsCount } = useSelector((state) => state.alarms);

  return (
    <>
      <NewAlarm />
      <Container fluid className="alarms-panel">
        {/* <div className="search-bar">
          <p>{`Total de alarmas: ${alarmsCount ? alarmsCount : 0}`}</p>
        </div> */}
        <Row>
          <Col sm={2} style={{ paddingRight: "0" }}>
            <AlarmsSidebar />
          </Col>
          <Col sm={10}>{idVideo ? <Outlet /> : <IdleAlarm />}</Col>
        </Row>
      </Container>
    </>
  );
};

export default AlarmsPanel;
