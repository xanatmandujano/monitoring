import React, { useState } from "react";
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
import { clearMessage } from "../../store/slices/messageSlice";
//React-router-dom
import { Navigate, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const { isLoggedIn, userName } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const userLogged = sessionStorage.getItem("userLogged");

  //Logout
  const logoutUser = () => {
    setLoader(true);
    dispatch(USER_LOGOUT())
      .unwrap()
      .then(() => {
        navigate("/");
        window.location.reload();
      });
  };

  return (
    <>
      <Navbar key="lg" expand="lg" className="nav-bar-main">
        <Container fluid>
          <Navbar.Brand href="#alarms-panel">
            <img src={logo.assets.logo} alt="logo-banbajio" width={100} />
          </Navbar.Brand>
          {userLogged ? (
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
              {userLogged ? (
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
          btnaction={logoutUser}
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
