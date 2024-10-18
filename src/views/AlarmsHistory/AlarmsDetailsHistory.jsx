import React, { useEffect, useState } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { addPlate } from "../../store/actions/useCasesActions";
import { alarmAttachments } from "../../store/actions/attachmentsActions";
import { clearMessage } from "../../store/slices/messageSlice";
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
import Loader from "../../components/Loader/Loader";
import ModalMessage from "../../components/ModalMessage/ModalMessage";

const AlarmsDetailsHistory = () => {
  const [loader, setLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const { idVideo } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.attachments);

  useEffect(() => {
    setLoader(true);
    dispatch(clearMessage());
    dispatch(alarmAttachments({ alarmId: idVideo }))
      .unwrap()
      .then(() => setLoader(false));
  }, [idVideo, dispatch]);

  const sendPlateNumber = (plate, useCaseCode) => {
    dispatch(addPlate({ plateText: plate, useCaseCode: useCaseCode }))
      .unwrap()
      .then((res) => {
        setModalShow(true);
      });
  };

  const closeAlarm = () => {
    return navigate("/alarms-history");
  };

  const dateTime = () => {
    const alarmDateTime = new Date(alarmFiles.creationDate);
    const alarmTime = alarmDateTime.toLocaleTimeString("es-MX");
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
              onClick={() => closeAlarm()}
            />
            {alarmFiles && alarmFiles.isEvent ? (
              <div style={{ justifyContent: "flex-end" }}>
                <Button
                  style={{ marginRight: ".5rem" }}
                  variant="main"
                  onClick={() =>
                    sendPlateNumber(
                      alarmFiles.additionalInformation,
                      "BlackList"
                    )
                  }
                >
                  Agregar a lista negra
                </Button>
                <Button
                  variant="main"
                  onClick={() =>
                    sendPlateNumber(
                      alarmFiles.additionalInformation,
                      "WhiteList"
                    )
                  }
                >
                  Agregar a lista blanca
                </Button>
              </div>
            ) : null}
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
                      {alarmFiles.alarmCode} - {alarmFiles.alarmDescription}{" "}
                      <br />
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

          <ModalMessage
            show={modalShow}
            btnAction={() => setModalShow(false)}
            onHide={() => setModalShow(false)}
            headermessage="Confirmación"
            message="La placa se agregó con éxito"
            btntext="Aceptar"
            display="none"
          />
        </>
      )}
    </Container>
  );
};

export default AlarmsDetailsHistory;
