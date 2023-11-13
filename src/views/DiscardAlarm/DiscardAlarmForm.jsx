import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { alarmStatus } from "../../store/actions/alarmsActions";
//React-router-dom
import { Navigate, useNavigate } from "react-router-dom";
//Components
import TextFieldArea from "../../components/TextField/TextFieldArea";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Loader from "../../components/Loader/Loader";

const DiscardAlarmForm = () => {
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.alarms);
  const navigate = useNavigate();

  const discardAlarm = (values) => {
    setLoader(true);
    setDisabled(true);
    dispatch(
      alarmStatus({
        alarmId: alarmFiles.alarmId,
        statusId: 4,
        comments: values.comments,
      })
    )
      .unwrap()
      .then(() => {
        setLoader(false);
        setDisabled(false);
        navigate("/alarms-panel");
        window.location.reload();
      })
      .catch(() => {
        setLoader(false);
        setDisabled(false);
      });
  };

  return (
    <Container className="accept-alarm-form">
      <Formik
        initialValues={{ comments: "" }}
        onSubmit={async (values) => {
          discardAlarm(values);
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
              placeholder="La alarma se descartó por..."
              disabled={disabled}
              readOnly={disabled}
            />

            <div className="btns-container">
              {/* <Button variant="main" onClick={props.onHide}>
                Cancelar
              </Button> */}

              <Button
                variant="main"
                type="submit"
                disabled={loader && <Loader />}
              >
                {loader ? <Loader /> : "Aceptar"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default DiscardAlarmForm;
