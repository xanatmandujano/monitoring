import React, { useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { alarmAttachments } from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
import { getAlarmAttachments } from "../../services/alarmsService";
//React router dom
import { useLocation, useParams } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";

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
    console.log(id);
  }, [id, dispatch]);

  useEffect(() => {
    const findImages = () => {
      let filtered =
        alarmFiles &&
        alarmFiles.attachments.filter((el) => el.attachmentTypeId === 1);
      setImages(filtered);
      console.log(images);
    };

    const findURL = () => {
      let filtered =
        alarmFiles &&
        alarmFiles.attachments.filter((el) => el.attachmentTypeId === 5);
      setUrls(filtered);
      console.log(urls);
    };

    findImages();
    findURL();
  }, [alarmFiles]);

  return (
    <Container className="alarm-details">
      <div className="btns-container">
        <Button variant="main" size="sm">
          Aceptar
        </Button>
        <Button variant="main" size="sm">
          Descartar
        </Button>
      </div>
      <Row>
        <Col sm={8}>
          {/* <video src="" autoPlay height="100%" width="100%" controls>
            Tu navegador no admite el elemento <code>video</code>.
          </video> */}
          <Image
            src={`data:image/png;base64,${alarmFiles.attachments[1].attachmentValue}`}
            alt="image"
            width="100%"
          />
          {/* <Image
            src={`data:image/png;base64,${images && images[1].attachmentValue}`}
            alt="image"
            width="100%"
          /> */}
        </Col>
        <Col sm={4}>
          <div className="alarm-data">
            {alarmFiles ? (
              <>
                <p>
                  {alarmFiles.alarmCode} - {alarmFiles.alarmDescription} <br />
                  Número de placa: <br />
                  {alarmFiles.additionalInformation} <br />
                  Ubicación <br />
                  {`${alarmFiles.branchCode} - ${alarmFiles.brachName}, ${alarmFiles.stateCode} (${alarmFiles.countryCode})`}{" "}
                  <br />
                  Hora de la alarma: <br />
                  {alarmFiles.creationDate}
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

export default AlarmDetails;
