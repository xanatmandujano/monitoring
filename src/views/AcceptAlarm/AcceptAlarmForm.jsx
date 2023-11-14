import React, { useEffect, useState } from "react";
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
import CheckInput from "../../components/CheckInput/CheckInput";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Loader from "../../components/Loader/Loader";

const AcceptAlarmForm = () => {
  //State
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState("none");
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.alarms);

  const findNull = () => {
    let filtered =
      alarmFiles &&
      alarmFiles.attachments.filter((el) => el.dewarpedTypeId === null);
    return filtered;
  };

  const findQuad = () => {
    let filtered =
      alarmFiles &&
      alarmFiles.attachments.filter((el) => el.dewarpedTypeId === 1);
    return filtered;
  };

  const findDouble = () => {
    let filtered =
      alarmFiles &&
      alarmFiles.attachments.filter((el) => el.dewarpedTypeId >= 2);
    return filtered;
  };

  const dewarpedNull = findNull();
  const dewarpedQuad = findQuad();
  const dewarpedDouble = findDouble();

  const handleShow = () => {
    if (show === "none") {
      setShow("block");
    } else if (show === "block") {
      setShow("none");
    }
  };

  //Accept alarm
  const sendAlarm = (values) => {
    setLoader(true);
    setDisabled(true);
    dispatch(
      validateCurrentAlarm({
        alarmId: alarmFiles && alarmFiles.alarmId,
        comments: values.comments,
        devices: [
          {
            deviceId: values.normalDevices[0],
            quadrants: null,
          },
          // {
          //   deviceId: values.quadDevices[0],
          //   quadrants: values.quads,
          // },
          {
            deviceId: values.doubleDevices[0],
            quadrants: values.double,
          },
        ],
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

  return (
    <Container className="accept-alarm-form">
      <Formik
        initialValues={{
          comments: "",
          normalDevices: [],
          doubleDevices: [],
          quadDevices: [],
          singleQuad: null,
          quads: [],
          double: [],
        }}
        onSubmit={async (values) => {
          JSON.stringify(values);
          sendAlarm(values);
        }}
      >
        {(props) => (
          <Form>
            <p>Selección de videos</p>
            {/* Devices */}
            {dewarpedNull.length >= 1
              ? dewarpedNull.map((item) => (
                  <CheckInput
                    key={item.alarmAttachmentId}
                    type="checkbox"
                    label={`Video 1`}
                    name="normalDevices"
                    value={item.deviceId}
                    disabled={disabled}
                  />
                ))
              : null}
            {dewarpedQuad.length >= 1
              ? dewarpedQuad.map((item) => (
                  <div className="dewarped-options" key={item.deviceId + 2}>
                    <CheckInput
                      type="checkbox"
                      label={`Video 2`}
                      name="quadDevices"
                      key={item.alarmAttachmentId}
                      value={item.deviceId}
                      disabled={disabled}
                    />

                    <Button
                      variant="main"
                      onClick={handleShow}
                      size="sm"
                      key={item.deviceId + 1}
                      disabled={disabled}
                    >
                      +
                    </Button>
                  </div>
                ))
              : null}
            {/* Quads */}
            <div style={{ display: show }}>
              {dewarpedQuad.length >= 1
                ? [1, 2, 3, 4].map((item) => (
                    <CheckInput
                      type="checkbox"
                      label={`Cuadrante ${item}`}
                      name="quads"
                      key={item + 1}
                      value={item}
                      disabled={disabled}
                    />
                  ))
                : null}
            </div>
            {dewarpedDouble.length >= 1
              ? dewarpedDouble.map((item) => (
                  <div className="dewarped-options" key={item.deviceId + 2}>
                    <CheckInput
                      type="checkbox"
                      label={`Video 2 (dewarped)`}
                      name="doubleDevices"
                      key={item.alarmAttachmentId}
                      value={item.deviceId}
                      disabled={disabled}
                    />
                    <Button
                      variant="main"
                      onClick={handleShow}
                      size="sm"
                      key={item.deviceId + 1}
                      disabled={disabled}
                    >
                      +
                    </Button>
                  </div>
                ))
              : null}
            {/* Double */}
            <div style={{ display: show }}>
              {dewarpedDouble.length >= 1
                ? [1, 2].map((item) => (
                    <CheckInput
                      type="checkbox"
                      label={`Cuadrante ${item}`}
                      name="double"
                      key={item + 1}
                      value={item}
                      disabled={disabled}
                    />
                  ))
                : null}
            </div>

            <TextFieldArea
              label="Comentarios"
              name="comments"
              type="text"
              value={props.values.comments}
              onChange={props.handleChange}
              placeholder="La alarma se validó por..."
              disabled={disabled}
              readOnly={disabled}
            />

            <div className="btns-container">
              {/* <Button variant="main" onClick={props.onHide} disabled={disabled}>
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

export default AcceptAlarmForm;
