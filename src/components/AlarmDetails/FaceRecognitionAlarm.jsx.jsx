import React, { useState, useEffect } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { alarmStatus, releaseAlarm } from "../../store/actions/alarmsActions";
import { alarmAttachments } from "../../store/actions/attachmentsActions";
import { clearMessage } from "../../store/slices/messageSlice";
import { hasPermission } from "../../services/authService";
import { useSendMessageMutation } from "../../store/api/signalRApi";
//React-router-dom
import { useParams, useNavigate } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import CloseButton from "react-bootstrap/CloseButton";
import Loader from "../Loader/Loader";
//Components
import DiscardAlarm from "../../views/DiscardAlarm/DiscardAlarm";
import AcceptAlarmFR from "../../views/AcceptAlarmFR/AcceptAlarmFR";

const FaceRecognitionAlarm = () => {
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [block, setBlock] = useState(true);

  const { userId } = useSelector((state) => state.persist.authState.authInfo);
  const { idVideo } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sendMessage] = useSendMessageMutation();
  const { alarmFiles } = useSelector((state) => state.attachments);

  useEffect(() => {
    setLoader(true);
    dispatch(clearMessage());
    dispatch(alarmAttachments({ alarmId: idVideo }))
      .unwrap()
      .then(async (res) => {
        setLoader(false);
        const userPermission = await hasPermission(res.alarmCode);
        if (!userPermission.data) {
          setBlock(true);
          navigate("/na");
        } else {
          setBlock(false);
          null;
        }
      });

    dispatch(
      alarmStatus({
        alarmId: idVideo,
        statusId: 2,
        comments: "",
      })
    ).unwrap();

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

    //Release alarm when user go back
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

  const sendAlarmStatus = async () => {
    const viewAction = {
      user: userId,
      message: JSON.stringify({
        action: "release",
        alarmId: alarmFiles.alarmId,
      }),
    };

    await sendMessage(viewAction).unwrap();
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

  const dateTime = () => {
    const alarmDateTime = new Date(alarmFiles.creationDate);
    const alarmTime = alarmDateTime.toLocaleDateString("es-MX");
    return alarmTime;
  };

  return (
    <Container className="alarm-details" fluid>
      <div className="btns-container">
        <div className="action-btns">
          <Button variant="main" size="sm" onClick={() => setShow(true)}>
            Aceptar
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
              src={
                block ? null : `${alarmFiles.attachments[0].attachmentValue}`
              }
              alt="rostro"
              width="100%"
            />
          ) : (
            <p>No se encontró información</p>
          )}
        </Col>
        <Col sm={3}>
          <div className="alarm-data">
            {block ? null : alarmFiles ? (
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
