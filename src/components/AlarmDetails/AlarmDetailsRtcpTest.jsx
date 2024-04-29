import React, { useEffect, useState } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { alarmStatus, releaseAlarm } from "../../store/actions/alarmsActions";
import { alarmAttachments } from "../../store/actions/attachmentsActions";
import { clearMessage } from "../../store/slices/messageSlice";
import { sendMessage } from "../../store/actions/notificationActions";
import { Connector } from "../../signalr/signalr-connection";
//RTC
import { webRTC, dataChannel, peerConn } from "../../scripts/webrtc";
//React router dom
import { useParams, useNavigate } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CloseButton from "react-bootstrap/CloseButton";
//Components
import AcceptAlarm from "../../views/AcceptAlarm/AcceptAlarm";
import DiscardAlarm from "../../views/DiscardAlarm/DiscardAlarm";

const AlarmDetailsRtcp = () => {
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  //const [elementId, setElementId] = useState("");
  const [connection, setConnection] = useState(null);
  const { userId } = useSelector((state) => state.persist.authState.authInfo);

  const { idVideo } = useParams();
  const navigate = useNavigate();
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
  }, [idVideo, dispatch]);

  const dateTime = () => {
    const alarmDateTime = new Date(alarmFiles.creationDate);
    const alarmTime = alarmDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return alarmTime;
  };

  const fetchRtcp = (k) => {
    if (dataChannel !== null && dataChannel.readyState == "open") {
      dataChannel.close();
    }
    if (peerConn != null && peerConn.iceConnectionState == "connected") {
      peerConn.close();
    }

    var found = alarmFiles.attachments.find((elem) => elem.deviceId == k);
    webRTC(`video${k}`, found.deviceId, found.attachmentValue);
  };

  const sendAlarmStatus = async () => {
    const chatMessage = {
      user: userId,
      message: JSON.stringify({
        action: "release",
        alarmId: alarmFiles.alarmId,
      }),
    };
    dispatch(sendMessage({ send: "SendToOthers", message: chatMessage }))
      .unwrap()
      .then(() => {
        console.log("Message sent from test");
      });
  };

  const closeAlarm = () => {
    dispatch(
      releaseAlarm({
        alarmId: alarmFiles.alarmId,
      })
    )
      .unwrap()
      .then(() => {
        sendAlarmStatus();
        navigate("/alarms-panel");
      });
  };

  return (
    <Container fluid className="alarm-details">
      <div className="btns-container">
        <div className="action-btns">
          <Button variant="main" size="sm" onClick={() => setShow(true)}>
            Validar
          </Button>
          <Button variant="main" size="sm" onClick={() => setShowDiscard(true)}>
            Descartar
          </Button>
        </div>
        <CloseButton
          variant="white"
          aria-label="Hide"
          onClick={() => closeAlarm()}
        />
      </div>

      <Row>
        <Col sm={9} className="main-image">
          <Tabs
            defaultActiveKey={alarmFiles && alarmFiles.attachments[0].deviceId}
            id="fill-tab-example"
            className="mb-3"
            data-bs-theme="dark"
            fill
            onSelect={(k) => fetchRtcp(k)}
          >
            {alarmFiles &&
              alarmFiles.attachments.map((item) => (
                <Tab.Container
                  eventKey={item.deviceId}
                  title={item.deviceName}
                  key={item.alarmAttachmentId}
                  rtcp={item.attachmentValue}
                >
                  <video
                    autoPlay
                    loop
                    height="100%"
                    width="100%"
                    controls
                    key={item.deviceCode}
                    id={`video${item.deviceId}`}
                  >
                    Tu navegador no admite el elemento <code>video</code>
                  </video>
                </Tab.Container>
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

export default AlarmDetailsRtcp;
