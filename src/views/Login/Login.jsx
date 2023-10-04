import React, { useState, useEffect } from "react";
//Formik & yup
import { Form, Formik } from "formik";
import * as yup from "yup";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../store/actions/authAction";
import { clearMessage } from "../../store/slices/messageSlice";
//React-router-dom
import { Navigate, useNavigate } from "react-router-dom";
//Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
//Components
import TextField from "../../components/TextField/TextField";
import PasswordField from "../../components/PasswordField/PasswordField";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const Login = () => {
  const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  //Login
  const loginUser = (values) => {
    setLoader(true);

    dispatch(userLogin({ email: values.email, password: values.password }))
      .unwrap()
      .then(() => {
        navigate("alarms-panel");
        window.location.reload();
      })
      .catch(() => {
        setLoader(false);
        !isLoggedIn ? setModalShow(true) : setModalShow(false);
      });
  };

  if (isLoggedIn) {
    return <Navigate to="alarms-panel" />;
  }

  const validationSchema = yup.object().shape({
    email: yup.string().required("yup.email"),
    password: yup.string().required("yup.password"),
  });

  return (
    <Container className="login-container">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          loginUser(values);
        }}
      >
        {(props) => (
          <Form>
            <p className="fs-3">Iniciar sesión</p>
            <TextField
              label="Correo electrónico"
              name="email"
              type="text"
              value={props.values.user}
              onChange={props.handleChange}
              errors="Correo no válido"
              placeholder="nombre@ejemplo.com"
            />
            <PasswordField
              label="Contraseña"
              name="password"
              value={props.values.password}
              onChange={props.handleChange}
              errors="Escriba su contraseña"
              placeholder="Ejemplo123"
            />

            <div className="btn-login">
              <Button
                variant="main"
                type="submit"
                disabled={loader && <Loader />}
              >
                {loader ? <Loader /> : "Iniciar sesión"}
              </Button>
            </div>

            <ErrorMessage
              show={modalShow}
              onHide={() => setModalShow(false)}
              message={message}
              headermessage="Ha ocurrido un error"
            />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
