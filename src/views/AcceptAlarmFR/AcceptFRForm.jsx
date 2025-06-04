import React, { useState } from "react";
//Formik & yup
import { Form, Formik } from "formik";
import * as yup from "yup";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { validateCurrentAlarm } from "../../store/actions/alarmsActions";
//React-router-dom
import { Navigate, useNavigate } from "react-router-dom";
//Components
import TextFieldArea from "../../components/TextField/TextFieldArea";
import TextField from "../../components/TextField/TextField";
import SelectField from "../../components/SelectField/SelectField";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Loader from "../../components/Loader/Loader";

const AcceptFRForm = ({ onHide }) => {
  //State
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState("none");
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.attachments);

  const sendAlarm = (values) => {
    setLoader(true);
    setDisabled(true);
    dispatch(
      validateCurrentAlarm({
        alarmId: alarmFiles.alarmId,
        comments: values.comments,
      })
    )
      .unwrap()
      .then(() => {
        console.log("Succedded");
        setLoader(false);
        setDisabled(false);
        navigate("/alarms-panel");
        window.location.reload();
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const validationSchema = yup.object().shape({
    comments: yup.string().required("yup.comments"),
  });

  return (
    <Container className="accept-alarm-form">
      <Formik
        initialValues={{ comments: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          sendAlarm(values);
        }}
      >
        {(props) => (
          <Form>
            <TextFieldArea
              label="Comentarios"
              name="comments"
              type="text"
              value={props.values.comments}
              onChange={props.handleChange}
              placeholder="La alarma se validó por..."
              disabled={disabled}
              readOnly={disabled}
              errors="Escriba un comentario"
            />
            <div className="btns-container">
              <Button variant="outline-light" onClick={onHide}>
                Cancelar
              </Button>

              <Button
                variant="main"
                type="submit"
                disabled={loader && <Loader />}
              >
                Aceptar {loader ? <Loader variant="light" size="sm" /> : null}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AcceptFRForm;
