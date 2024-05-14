import React from "react";
import { useSelector } from "react-redux";
//React router dom
import { Outlet, useParams } from "react-router-dom";

//Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
//Components
import AlarmsSidebar from "../AlarmsSidebar/AlarmsSidebar";
import IdleAlarm from "../../components/AlarmDetails/IdleAlarm";

const AlarmsPanel = () => {
  const { idVideo } = useParams();
  const { alarmsCount } = useSelector((state) => state.alarms);

  return (
    <>
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
