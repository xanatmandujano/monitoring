import React, { useEffect, useState } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { alarmStatus } from "../../store/actions/alarmsActions";
import { alarmAttachments } from "../../store/actions/attachmentsActions";
import { clearMessage } from "../../store/slices/messageSlice";
//Helmet
import { Helmet } from "react-helmet-async";
import { webRTC } from "../../scripts/webrtc";
//React router dom
import { useParams } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
//Components
import AcceptAlarm from "../../views/AcceptAlarm/AcceptAlarm";
import DiscardAlarm from "../../views/DiscardAlarm/DiscardAlarm";

const AlarmDetailsVideo = () => {
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [videoId, setVideoId] = useState("videoElement");

  const { idVideo } = useParams();

  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.attachments);

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(
      alarmStatus({
        alarmId: idVideo,
        statusId: 2,
        comments: "",
      })
    )
      .unwrap()
      .then(() => {
        dispatch(alarmAttachments({ alarmId: idVideo })).unwrap();
      });

    webRTC("reowhite", "videoElement");
  }, [idVideo, dispatch]);

  const dateTime = () => {
    const alarmDateTime = new Date(alarmFiles.creationDate);
    const alarmTime = alarmDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return alarmTime;
  };

  return (
    <Container fluid className="alarm-details">
      <div className="btns-container">
        <Button variant="main" size="sm" onClick={() => setShow(true)}>
          Validar
        </Button>
        <Button variant="main" size="sm" onClick={() => setShowDiscard(true)}>
          Descartar
        </Button>
      </div>

      <Row>
        <Col sm={9} className="main-image">
          <Tabs
            defaultActiveKey={
              alarmFiles && alarmFiles.attachments[0].deviceId + 1
            }
            id="fill-tab-example"
            className="mb-3"
            data-bs-theme="dark"
            fill
          >
            {alarmFiles &&
              alarmFiles.attachments.map((item) => (
                <Tab
                  eventKey={item.deviceId + 1}
                  title={item.deviceName}
                  key={item.attachmentName}
                >
                  <video
                    autoPlay
                    loop
                    height="100%"
                    width="100%"
                    controls
                    //src={item.attachmentValue}
                    id={"videoElement"}
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

      <AcceptAlarm show={show} onHide={() => setShow(false)} />
      <DiscardAlarm show={showDiscard} onHide={() => setShowDiscard(false)} />
    </Container>
  );
};

export default AlarmDetailsVideo;
