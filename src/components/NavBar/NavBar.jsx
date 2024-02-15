import React, { useEffect, useState } from "react";
//Bootstrap
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import ModalMessage from "../ModalMessage/ModalMessage";
//Logo
import logo from "/config.json";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { USER_LOGOUT } from "../../store/actions/authAction";
//React-router-dom
import { useNavigate, useParams } from "react-router-dom";
import { Connector } from "../../signalr/signalr-connection";

const NavBar = () => {
  const navigate = useNavigate();
  const { idVideo } = useParams();
  const { isLoggedIn, userName, userId } = useSelector(
    (state) => state.persist.authState.authInfo
  );
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [connection, setConnection] = useState("");

  useEffect(() => {
    const newConnection = Connector();
    setConnection(newConnection);
    newConnection.start();
  }, []);

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
          console.log("Alarm release: logout");
        });
      }
    } catch (error) {
      console.log(error);
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
          window.location.reload();
        });
    } else {
      dispatch(USER_LOGOUT({ isLogged: false }))
        .unwrap()
        .then(() => {
          navigate("/");
          window.location.reload();
        });
    }
  };

  return (
    <>
      <Navbar key="lg" expand="lg" className="nav-bar-main">
        <Container fluid>
          <Navbar.Brand href="#alarms-panel">
            <img src={logo.assets.logo} alt="logo-banbajio" width={100} />
          </Navbar.Brand>
          {isLoggedIn ? (
            <>
              <Nav.Link href="#alarms-panel" className="page-title">
                Panel de alarmas
              </Nav.Link>
              <Nav.Link
                href="#alarms-history"
                style={{ color: "white", marginLeft: "1rem" }}
                className="page-title"
              >
                Historial de alarmas
              </Nav.Link>
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
                </Nav>
              ) : null}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>

        <ModalMessage
          show={modalShow}
          onClick={() => logoutUser()}
          onHide={() => setModalShow(false)}
          headermessage="Cerrar sesión"
          message="¿Quieres cerrar tu sesión?"
          btntext="Aceptar"
        />
      </Navbar>
    </>
  );
};

export default NavBar;
