import React, { useEffect, useState, useRef } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { alarmStatus, releaseAlarm } from "../../store/actions/alarmsActions";
import {
  alarmAttachments,
  getAlarmAttachment,
} from "../../store/actions/attachmentsActions";
import { clearAlarmAttachment } from "../../store/slices/attachmentsSlice";
import { clearMessage } from "../../store/slices/messageSlice";
import { Connector } from "../../signalr/signalr-connection";
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
import Loader from "../Loader/Loader";
import VideoLoader from "../Loader/VideoLoader";
import FullLoader from "../Loader/FullLoader";

const AlarmDetailsVideo = () => {
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [connection, setConnection] = useState(null);
  const { userId } = useSelector((state) => state.persist.authState.authInfo);
  const { idVideo } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alarmFiles, alarmAttachment, loading } = useSelector(
    (state) => state.attachments
  );

  /*Video play speed*/
  const videoRef = useRef(null);

  function setPlaySpeed(id) {
    const map = getMap();
    const node = map.get(id);
    if (node) {
      node.playbackRate = 0.25;
    }
  }

  function getMap() {
    if (!videoRef.current) {
      videoRef.current = new Map();
    }

    return videoRef.current;
  }

  useEffect(() => {
    setLoader(true);
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
        dispatch(alarmAttachments({ alarmId: idVideo }))
          .unwrap()
          .then(() => setLoader(false));
      });

    const newConnection = Connector();
    setConnection(newConnection);
    newConnection.start();
  }, [idVideo, dispatch]);

  const fetchAttachment = (attachmentId) => {
    //dispatch(clearAlarmAttachment());
    dispatch(getAlarmAttachment({ attachmentId: attachmentId })).unwrap();
  };

  const dateTime = () => {
    const alarmDateTime = new Date(alarmFiles.creationDate);
    const alarmTime = alarmDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return alarmTime;
  };

  const sendAlarmStatus = async () => {
    const chatMessage = {
      user: userId,
      message: JSON.stringify({
        action: "release",
        alarmId: alarmFiles.alarmId,
      }),
    };
    try {
      if (connection) {
        await connection.send("SendToOthers", chatMessage).then(() => {
          //console.log("Message sent");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeAlarm = () => {
    setBtnLoader(true);
    dispatch(
      releaseAlarm({
        alarmId: alarmFiles.alarmId,
      })
    )
      .unwrap()
      .then(() => {
        sendAlarmStatus();
        navigate("/alarms-panel");
        setBtnLoader(false);
      });
  };

  return (
    <>
      <Container fluid className="alarm-details">
        <div className="btns-container">
          <div className="action-btns">
            <Button
              variant="main"
              size="sm"
              onClick={() => setShow(true)}
              disabled={loader}
            >
              Validar
            </Button>
            <Button
              variant="main"
              size="sm"
              onClick={() => setShowDiscard(true)}
              disabled={loader}
            >
              Descartar
            </Button>
          </div>
          {btnLoader ? (
            <Loader />
          ) : (
            <CloseButton
              variant="white"
              aria-label="Hide"
              onClick={() => closeAlarm()}
            />
          )}
        </div>

        {loader ? (
          <FullLoader />
        ) : (
          <>
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
                  onSelect={(k) => fetchAttachment(k)}
                >
                  {alarmFiles &&
                    alarmFiles.attachments.map((item) => (
                      <Tab.Container
                        eventKey={item.alarmAttachmentId}
                        title={item.deviceName}
                        key={item.attachmentName}
                        //attachment={item.alarmAttachmentId}
                      >
                        {loading ? (
                          <VideoLoader />
                        ) : (
                          <video
                            autoPlay
                            loop
                            height="100%"
                            width="100%"
                            controls
                            ref={(node) => {
                              const map = getMap();
                              if (node) {
                                map.set(item.alarmAttachmentId, node);
                              } else {
                                map.delete(item.alarmAttachmentId);
                              }
                            }}
                            onLoadStart={() =>
                              setPlaySpeed(
                                alarmAttachment &&
                                  alarmAttachment.alarmAttachmentId
                              )
                            }
                            src={
                              alarmAttachment && alarmAttachment.attachmentValue
                            }
                            id={`video-${
                              alarmAttachment &&
                              alarmAttachment.alarmAttachmentId
                            }`}
                          >
                            Tu navegador no admite el elemento{" "}
                            <code>video</code>
                          </video>
                        )}
                      </Tab.Container>
                    ))}
                </Tabs>
              </Col>
              <Col sm={3}>
                <div className="alarm-data">
                  {alarmFiles ? (
                    <>
                      <p>
                        {alarmFiles.alarmCode} - {alarmFiles.alarmDescription}{" "}
                        <br />
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
            <DiscardAlarm
              show={showDiscard}
              onHide={() => setShowDiscard(false)}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default AlarmDetailsVideo;
