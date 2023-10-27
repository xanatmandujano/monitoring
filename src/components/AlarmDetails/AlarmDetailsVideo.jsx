import React, { useEffect, useState } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { alarmAttachments } from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
//React router dom
import { useParams } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const AlarmDetailsVideo = () => {
  const [loader, setLoader] = useState(false);
  let [videoCount, setVideoCount] = useState(1);

  const { idVideo } = useParams();

  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.alarms);

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(alarmAttachments({ alarmId: idVideo })).unwrap();
  }, [idVideo, dispatch]);

  const dateTime = () => {
    const alarmDateTime = new Date(alarmFiles.creationDate);
    const alarmTime = alarmDateTime.toLocaleTimeString("es-MX");
    return alarmTime;
  };

  return (
    <Container fluid className="alarm-details">
      <div className="btns-container">
        <Button variant="main" size="sm">
          Aceptar
        </Button>
        <Button variant="main" size="sm">
          Descartar
        </Button>
      </div>
      <Row>
        <Col sm={9} className="main-image">
          <Tabs
            defaultActiveKey={`video${videoCount}`}
            id="fill-tab-example"
            className="mb-3"
            data-bs-theme="dark"
            fill
          >
            {alarmFiles &&
              alarmFiles.attachments.map((item) => (
                <Tab
                  eventKey={`video${videoCount}`}
                  title={`Video ${videoCount++}`}
                  key={item.attachmentName}
                >
                  <video
                    autoPlay
                    loop
                    height="100%"
                    width="100%"
                    controls
                    src={`data:video/mp4;base64,${item.attachmentValue}`}
                  >
                    Tu navegador no admite el elemento <code>video</code>
                  </video>
                </Tab>
              ))}
          </Tabs>
        </Col>
        <Col sm={3}>
          <div className="alarm-data">
            {alarmFiles ? (
              <>
                <p>
                  {alarmFiles.alarmCode} - {alarmFiles.alarmDescription} <br />
                </p>
                <p>
                  Panel: <br />
                  {`${alarmFiles.panelCode}`}
                </p>
                <p>
                  Cámara: <br />
                  {`${alarmFiles.deviceCode} - ${alarmFiles.deviceIPAddress}`}
                </p>
                <p>
                  Ubicación: <br />
                  {`${alarmFiles.branchCode} - ${alarmFiles.branchName}, ${alarmFiles.stateCode} (${alarmFiles.countryCode})`}{" "}
                </p>
                <p>
                  Hora de la alarma: <br />
                  {dateTime()}
                </p>
              </>
            ) : (
              <p>No se encontró información</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AlarmDetailsVideo;
