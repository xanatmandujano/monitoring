import React, { useState, useEffect } from "react";
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
import Image from "react-bootstrap/Image";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const AlarmDetails = () => {
  const [loader, setLoader] = useState(false);
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);

  //let location = useLocation();
  //let alarmID = location.state;
  const { id } = useParams();

  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.alarms);

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(alarmAttachments({ alarmId: id })).unwrap();
    //console.log(id);
  }, [id, dispatch]);

  // useEffect(() => {
  //   const findImages = () => {
  //     let filtered =
  //       alarmFiles &&
  //       alarmFiles.attachments.filter((el) => el.attachmentTypeId === 1);
  //     setImages(filtered);
  //     //console.log(images);
  //   };

  //   const findURL = () => {
  //     let filtered =
  //       alarmFiles &&
  //       alarmFiles.attachments.filter((el) => el.attachmentTypeId === 5);
  //     setUrls(filtered);
  //   };

  //   findImages();
  //   findURL();
  // }, [alarmFiles]);

  const dateTime = () => {
    const alarmDateTime = new Date(alarmFiles.creationDate);
    const alarmTime = alarmDateTime.toLocaleTimeString("es-MX");
    return alarmTime;
  };

  return (
    <Container className="alarm-details" fluid>
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
          {alarmFiles ? (
            <Image
              src={`data:image/png;base64,${alarmFiles.attachments[1].attachmentValue}`}
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
                      src={`data:image/png;base64,${alarmFiles.attachments[0].attachmentValue}`}
                      alt="Placa"
                      className="tab-image"
                    />
                  </Tab>
                  <Tab eventKey="vehiculo" title="Vehiculo">
                    <img
                      src={`data:image/png;base64,${alarmFiles.attachments[1].attachmentValue}`}
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
    </Container>
  );
};

export default AlarmDetails;
