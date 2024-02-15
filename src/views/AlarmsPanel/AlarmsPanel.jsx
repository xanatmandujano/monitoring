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
import { getAlarmData } from "../../services/alarmsService";
import NewAlarm from "./NewAlarm";

const AlarmsPanel = () => {
  const { idVideo } = useParams();
  const dispatch = useDispatch();
  const { alarmsCount } = useSelector((state) => state.alarms);
  const [connection, setConnection] = useState("");

  useEffect(() => {
    dispatch(clearMessage());
    const newConnection = Connector();
    setConnection(newConnection);
  }, [dispatch]);

  return (
    <>
      <NewAlarm />
      <Container fluid className="alarms-panel">
        <div className="search-bar">
          <p>{`Total de alarmas: ${alarmsCount ? alarmsCount : 0}`}</p>
        </div>
        <Row>
          <Col sm={2} style={{ paddingRight: "0" }}>
            <AlarmsSidebar connection={connection} />
          </Col>
          <Col sm={10}>{idVideo ? <Outlet /> : <IdleAlarm />}</Col>
        </Row>
      </Container>
    </>
  );
};

export default AlarmsPanel;
