import React, { useEffect, useState } from "react";
//Bootstrap
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import ModalMessage from "../ModalMessage/ModalMessage";
import DocumentModal from "../ModalMessage/DocumentModal";
import { MdOutlineLiveHelp } from "react-icons/md";
import PdfViewer from "../PdfViewer/PdfViewer";
//Logo
import banbajio from "/config.json";
import oxxo from "/config.json";
import afirme from "/config.json";
import asur from "/config.json";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { USER_LOGOUT } from "../../store/actions/authAction";
import { releaseAlarm } from "../../store/actions/alarmsActions";
//React-router-dom
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Connector } from "../../signalr/signalr-connection";

const NavBar = () => {
  const navigate = useNavigate();
  const { idVideo } = useParams();
  let location = useLocation();

  const { isLoggedIn, userName, userId } = useSelector(
    (state) => state.persist.authState.authInfo
  );
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [manualShow, setManualShow] = useState(false);
  const [connection, setConnection] = useState("");
  const [activeStyle, setActiveStyle] = useState({
    alarmsPanel: { variant: "secondary" },
    alarmsHistory: { variant: "secondary" },
    divarStatus: { variant: "secondary" },
  });

  const mode = import.meta.env.MODE;

  useEffect(() => {
    if (location.pathname === "/alarms-panel") {
      setActiveStyle({
        alarmsPanel: { variant: "transparency-tertiary" },
        alarmsHistory: { variant: "secondary" },
        divarStatus: { variant: "secondary" },
      });
    } else if (location.pathname === "/alarms-history") {
      setActiveStyle({
        alarmsPanel: { variant: "secondary" },
        alarmsHistory: { variant: "transparency-tertiary" },
        divarStatus: { variant: "secondary" },
      });
    } else if (location.pathname === "/divar-status") {
      setActiveStyle({
        alarmsPanel: { variant: "secondary" },
        alarmsHistory: { variant: "secondary" },
        divarStatus: { variant: "transparency-tertiary" },
      });
    }

    const newConnection = Connector();
    setConnection(newConnection);
    newConnection.start();
  }, [location]);

  //Send message
  const sendAlarmStatus = async () => {
    const releaseAction = {
      user: userId,
      message: JSON.stringify({
        action: "release",
        alarmId: idVideo,
      }),
    };

    try {
      if (connection) {
        await connection.send("SendToAll", releaseAction).then(() => {
          //console.log("Alarm release: from change window");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeWindow = (link) => {
    if (idVideo) {
      console.log("1");
      dispatch(releaseAlarm({ alarmId: idVideo }));
      console.log("2");
      sendAlarmStatus(idVideo);
      console.log("3");
      navigate(link);
      console.log("3");
      //window.location.reload();
    } else {
      console.log("5");
      navigate(link);
      //window.location.reload();
    }
  };
  //Logout
  const logoutUser = () => {
    setLoader(true);
    //setModalShow(false);
    if (idVideo) {
      sendAlarmStatus(idVideo);
      dispatch(USER_LOGOUT({ alarmId: idVideo, isLogged: false }))
        .unwrap()
        .then(() => {
          navigate("/");
          setModalShow(false);
          window.location.reload();
        });
    } else {
      dispatch(USER_LOGOUT({ isLogged: false }))
        .unwrap()
        .then(() => {
          navigate("/");
          setModalShow(false);
          window.location.reload();
        });
    }
  };

  return (
    <>
      <Navbar key="lg" expand="lg" className="nav-bar-main">
        <Container>
          <Navbar.Brand>
            <img
              src={
                mode === "ox"
                  ? oxxo.assets.oxxo
                  : mode === "bb"
                  ? banbajio.assets.banbajio
                  : mode === "af"
                  ? afirme.assets.afirme
                  : asur.assets.asur
              }
              alt="logo"
              width={100}
            />
          </Navbar.Brand>
          {isLoggedIn ? (
            <>
              <Button
                id="nav-al-pan"
                onClick={() => handleChangeWindow("alarms-panel")}
                className="page-title"
                variant={activeStyle.alarmsPanel.variant}
                active
              >
                Panel de alarmas
              </Button>
              <Button
                id="nav-al-his"
                onClick={() => handleChangeWindow("alarms-history")}
                style={{
                  color: "white",
                  marginLeft: "1rem",
                }}
                className="page-title"
                variant={activeStyle.alarmsHistory.variant}
                active
              >
                Historial de alarmas
              </Button>
              <Button
                id="nav-divar"
                onClick={() => handleChangeWindow("divar-status")}
                style={{
                  color: "white",
                  marginLeft: "1rem",
                }}
                className="page-title"
                variant={activeStyle.divarStatus.variant}
                active
              >
                Divar estatus
              </Button>
            </>
          ) : (
            <Nav.Link href="#" className="page-title">
              Panel de alarmas
            </Nav.Link>
          )}

          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${"lg"}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                Panel de alarmas
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {isLoggedIn ? (
                <Nav
                  className="justify-content-end flex-grow-1 pe-3"
                  style={{ alignItems: "center" }}
                >
                  <Nav.Item className="user-name">{userName}</Nav.Item>
                  <Button
                    onClick={() => setModalShow(true)}
                    variant="main"
                    className="btn-logout"
                  >
                    Cerrar sesión
                  </Button>

                  {mode === "af" || mode === "as" ? null : (
                    <Nav.Item className="help">
                      <Button
                        variant="main"
                        size="md"
                        onClick={() => setManualShow(true)}
                      >
                        <MdOutlineLiveHelp />
                      </Button>
                    </Nav.Item>
                  )}
                </Nav>
              ) : null}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>

        <ModalMessage
          show={modalShow}
          btnAction={() => logoutUser()}
          onHide={() => setModalShow(false)}
          headermessage="Cerrar sesión"
          message="¿Quieres cerrar tu sesión?"
          btntext="Aceptar"
        />

        {mode === "af" ? null : (
          <DocumentModal
            show={manualShow}
            onHide={() => setManualShow(false)}
            headermessage="Manual"
            message={<PdfViewer />}
          />
        )}
      </Navbar>
    </>
  );
};

export default NavBar;
