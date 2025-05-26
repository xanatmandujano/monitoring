import React, { useState, useEffect } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { alarmAttachments } from "../../store/actions/attachmentsActions";
import { clearMessage } from "../../store/slices/messageSlice";
import { hasPermission } from "../../services/authService";
//React-router-dom
import { useParams, useNavigate, useLocation } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import CloseButton from "react-bootstrap/CloseButton";
import Loader from "../../components/Loader/Loader";

const AlarmDetailsFRHistory = () => {
  const [loader, setLoader] = useState(false);
  const [block, setBlock] = useState(true);

  const { idVideo } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.attachments);

  useEffect(() => {
    setLoader(true);
    dispatch(clearMessage());
    dispatch(alarmAttachments({ alarmId: idVideo }))
      .unwrap()
      .then(async (res) => {
        setLoader(false);
        const permission = await hasPermission(res.alarmCode);
        if (!permission.data) {
          setBlock(true);
          navigate("/na");
        } else {
          setBlock(false);
          null;
        }
      });
  }, [idVideo, dispatch]);

  const dateTime = () => {
    const alarmDateTime = new Date(alarmFiles.creationDate);
    const alarmTime = alarmDateTime.toLocaleDateString("es-MX");
    return alarmTime;
  };

  return (
    <Container className="alarm-details" fluid>
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
              onClick={() => navigate("/alarms-history")}
            />
          </div>
          <Row>
            <Col sm={9} className="main-image">
              {alarmFiles ? (
                <Image
                  src={
                    block
                      ? null
                      : `${alarmFiles.attachments[0].attachmentValue}`
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
                      {alarmFiles.alarmCode} - {alarmFiles.alarmDescription}{" "}
                      <br />
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
        </>
      )}
    </Container>
  );
};

export default AlarmDetailsFRHistory;
