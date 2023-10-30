import React, { useEffect, useState } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import {
  alarmAttachments,
  validateCurrentAlarm,
} from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
//React router dom
import { useParams } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
//Components
import CheckInput from "../CheckInput/CheckInput";

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
    const alarmTime = alarmDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return alarmTime;
  };

  const acceptAlarm = (values) => {
    dispatch(
      validateCurrentAlarm({
        alarmId: values.alarmId,
        userId: values.userId,
        comments: values.comments,
      })
    )
      .unwrap()
      .then(() => {
        console.log("Alarma validada con éxito");
      });
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
      {/* Dewarped selection */}
      <div className="btns-container">
        <p style={{ color: "#fff" }}>Seleccion de videos</p>
        <CheckInput label="Video 1" type="checkbox" data-bs-theme="dark" />
      </div>

      <Row>
        <Col sm={9} className="main-image">
          <Tabs
            defaultActiveKey={
              alarmFiles && alarmFiles.attachments[0].deviceName
            }
            id="fill-tab-example"
            className="mb-3"
            data-bs-theme="dark"
            fill
          >
            {alarmFiles &&
              alarmFiles.attachments.map((item) => (
                <Tab
                  eventKey={item.deviceName}
                  title={item.deviceName}
                  key={item.attachmentName}
                >
                  <video
                    autoPlay
                    loop
                    height="100%"
                    width="100%"
                    controls
                    src={item.attachmentValue}
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
                {/* <p>
                  Panel: <br />
                  {`${alarmFiles.panelCode}`}
                </p> */}
                <p>
                  Dispositivo: <br />
                  {`${alarmFiles.deviceCode}`}
                </p>
                <p>
                  Dirección IP: <br />
                  {`${alarmFiles.deviceIPAddress}`}
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
