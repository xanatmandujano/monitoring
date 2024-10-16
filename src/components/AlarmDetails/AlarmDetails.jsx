import React, { useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { alarmStatus, releaseAlarm } from "../../store/actions/alarmsActions";
import { alarmAttachments } from "../../store/actions/attachmentsActions";
import { clearMessage } from "../../store/slices/messageSlice";
import { Connector } from "../../signalr/signalr-connection";
//React router dom
import { useParams, useNavigate } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CloseButton from "react-bootstrap/CloseButton";
//Components
import DiscardAlarm from "../../views/DiscardAlarm/DiscardAlarm";
import AcceptAlarmFR from "../../views/AcceptAlarmFR/AcceptAlarmFR";
import Loader from "../Loader/Loader";

const AlarmDetails = () => {
  const [loader, setLoader] = useState(false);
  //const [images, setImages] = useState([]);
  //const [urls, setUrls] = useState([]);
  const [btnLoader, setBtnLoader] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [show, setShow] = useState(false);
  const [connection, setConnection] = useState(null);
  const { userId } = useSelector((state) => state.persist.authState.authInfo);
  const { idVideo } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.attachments);

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
          console.log("Message sent");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoader(true);
    dispatch(clearMessage());
    dispatch(alarmAttachments({ alarmId: idVideo }))
      .unwrap()
      .then(() => setLoader(false));

    if (alarmFiles.status === "Validada") {
      console.log("The status is validada");
    } else if (alarmFiles.status === "Descartada") {
      console.log("The status is descartada");
    } else {
      dispatch(
        alarmStatus({
          alarmId: alarmFiles.alarmId,
          statusId: 2,
          comments: "",
        })
      ).unwrap();
    }

    const newConnection = Connector();
    setConnection(newConnection);
    newConnection.start();

    //Release alarm when tab is closed
    window.addEventListener("beforeunload", (e) => {
      if (e) {
        dispatch(
          releaseAlarm({
            alarmId: alarmFiles.alarmId,
          })
        )
          .unwrap()
          .then(() => {
            console.log("Success");
          });
        sendAlarmStatus();
        e.preventDefault();
        //window.open(window.location.origin, "_blank");
        return false;
      }
    });

    window.addEventListener("popstate", (e) => {
      dispatch(
        releaseAlarm({
          alarmId: idVideo,
        })
      )
        .unwrap()
        .then(() => {
          sendAlarmStatus();
        });
      e.preventDefault();
    });
  }, [idVideo, dispatch]);

  const dateTime = () => {
    const alarmDateTime = new Date(alarmFiles.creationDate);
    const alarmTime = alarmDateTime.toLocaleTimeString("es-MX");
    return alarmTime;
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

      <Row>
        <Col sm={9} className="main-image">
          {alarmFiles ? (
            <Image
              src={`data:image/png;base64, ${alarmFiles.attachments[1].attachmentValue}`}
              alt="image"
              width="100%"
            />
          ) : (
            <p>No se encontró información</p>
          )}
        </Col>
        <Col sm={3}>
          <div className="alarm-data">
            {alarmFiles ? (
              <>
                <p>
                  {alarmFiles.alarmCode} - {alarmFiles.alarmDescription} <br />
                </p>
                <p>
                  Número de placa: <br />
                  {alarmFiles.additionalInformation} <br />
                </p>
                <p>
                  {alarmFiles.comments} <br />
                </p>
                <p>
                  Ubicación: <br />
                  {`${alarmFiles.branchCode} - ${alarmFiles.branchName}, ${alarmFiles.stateCode} (${alarmFiles.countryCode})`}{" "}
                </p>
                <p>
                  Hora de la alarma: <br />
                  {dateTime()}
                </p>
                <Tabs
                  defaultActiveKey="placa"
                  id="fill-tab-example"
                  className="mb-3"
                  data-bs-theme="dark"
                  fill
                >
                  <Tab eventKey="placa" title="Placa">
                    <img
                      src={`data:image/png;base64, ${alarmFiles.attachments[0].attachmentValue}`}
                      alt="Placa"
                      className="tab-image"
                    />
                  </Tab>
                  <Tab eventKey="vehiculo" title="Vehiculo">
                    <img
                      src={`data:image/png;base64, ${alarmFiles.attachments[1].attachmentValue}`}
                      alt="Vehículo"
                      className="tab-image"
                    />
                  </Tab>
                </Tabs>
              </>
            ) : (
              <p>No se encontró información</p>
            )}
          </div>
        </Col>
      </Row>

      <AcceptAlarmFR show={show} onHide={() => setShow(false)} />
      <DiscardAlarm show={showDiscard} onHide={() => setShowDiscard(false)} />
    </Container>
  );
};

export default AlarmDetails;
