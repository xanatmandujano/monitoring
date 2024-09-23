import React, { useEffect, useState, useRef } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { alarmAttachments } from "../../store/actions/attachmentsActions";
import { clearMessage } from "../../store/slices/messageSlice";
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
import Loader from "../../components/Loader/Loader";

const AlarmDetailsVideoHistory = () => {
  const [loader, setLoader] = useState(false);

  const { idVideo } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.attachments);

  useEffect(() => {
    dispatch(clearMessage());
    setLoader(true);
    dispatch(alarmAttachments({ alarmId: idVideo }))
      .unwrap()
      .then(() => {
        setLoader(false);
      });
  }, [idVideo, dispatch]);

  const handleBtn = () => {
    return navigate("/alarms-history");
  };

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
      {loader ? (
        <Loader />
      ) : (
        <>
          <div
            className="btns-container"
            style={{ flexDirection: "row-reverse" }}
          >
            <CloseButton
              variant="white"
              aria-label="Hide"
              onClick={() => handleBtn()}
            />
          </div>
          {alarmFiles && alarmFiles.attachments.length <= 0 ? (
            <p style={{ color: "white", marginTop: "1rem" }}>
              No se encontraron archivos
            </p>
          ) : (
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
                          src={item.attachmentValue}
                          ref={(node) => {
                            const map = getMap();
                            if (node) {
                              map.set(item.alarmAttachmentId, node);
                            } else {
                              map.delete(item.alarmAttachmentId);
                            }
                          }}
                          onLoadStart={() =>
                            setPlaySpeed(item.alarmAttachmentId)
                          }
                          id={`video-${item.alarmAttachmentId}`}
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
          )}
        </>
      )}
    </Container>
  );
};

export default AlarmDetailsVideoHistory;
