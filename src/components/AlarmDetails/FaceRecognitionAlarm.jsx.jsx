import React, { useState, useEffect } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { alarmStatus } from "../../store/actions/alarmsActions";
import { alarmAttachments } from "../../store/actions/attachmentsActions";
import { clearMessage } from "../../store/slices/messageSlice";
//React-router-dom
import { useParams } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
//Components
import DiscardAlarm from "../../views/DiscardAlarm/DiscardAlarm";
import AcceptAlarmFR from "../../views/AcceptAlarmFR/AcceptAlarmFR";

const FaceRecognitionAlarm = () => {
  const [show, setShow] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
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
    //console.log(id);
  }, [idVideo, dispatch]);

  const dateTime = () => {
    const alarmDateTime = new Date(alarmFiles.creationDate);
    const alarmTime = alarmDateTime.toLocaleDateString("es-MX");
    return alarmTime;
  };

  return (
    <Container className="alarm-details" fluid>
      <div className="btns-container">
        <Button variant="main" size="sm" onClick={() => setShow(true)}>
          Aceptar
        </Button>
        <Button variant="main" size="sm" onClick={() => setShowDiscard(true)}>
          Descartar
        </Button>
      </div>
      <Row>
        <Col sm={9} className="main-image">
          {alarmFiles ? (
            <Image
              src={`${alarmFiles.attachments[0].attachmentValue}`}
              alt="rostro"
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
                  Información registrada: <br />
                  {alarmFiles.additionalInformation} <br />
                </p>
                {/* <p>
                  {alarmFiles.comments} <br />
                </p> */}
                <p>
                  Ubicación: <br />
                  {`${alarmFiles.branchCode} - ${alarmFiles.branchName}, ${alarmFiles.stateCode} (${alarmFiles.countryCode})`}{" "}
                </p>
                <p>
                  Hora de la alarma: <br />
                  {dateTime()}
                </p>
                <div className="face-container">
                  <img
                    src={`${alarmFiles.attachments[1].attachmentValue}`}
                    alt="Rostro"
                    className="face-image"
                  />
                </div>
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

export default FaceRecognitionAlarm;
