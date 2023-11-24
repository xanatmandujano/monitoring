import React, { useEffect, useState } from "react";
//Formik & yup
import { Form, Formik } from "formik";
import * as yup from "yup";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { validateSeprobanAlarm } from "../../store/actions/alarmsActions";
//React-router-dom
import { Navigate, useNavigate } from "react-router-dom";
//Components
import TextFieldArea from "../../components/TextField/TextFieldArea";
import CheckInput from "../../components/CheckInput/CheckInput";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Loader from "../../components/Loader/Loader";

const AcceptAlarmForm = ({ onHide }) => {
  //State
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState("none");
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.attachments);

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
      validateSeprobanAlarm({
        alarmId: alarmFiles && alarmFiles.alarmId,
        comments: values.comments,
        devices: values.checkboxGroup,
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
    //normalDevices: yup.array().min(1).required(),
    //doubleDevices: yup.array().min(1).required(),
    //quadDevices: yup.array().min(1).required(),
    //quads: yup.array().min(1).required(),
    //double: yup.array().min(1).required(),
    checkboxGroup: yup.array().min(1).required(),
  });

  return (
    <Container className="accept-alarm-form">
      <Formik
        initialValues={{
          comments: "",
          normalDevices: [],
          doubleDevices: [],
          quadDevices: [],
          checkboxGroup: [],
          singleQuad: null,
          quads: [],
          double: [],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          JSON.stringify(values);
          sendAlarm(values);
        }}
      >
        {(props) => (
          <Form>
            <p>Selección de videos</p>
            {/* Devices */}
            {dewarpedNull && dewarpedNull.length >= 1
              ? dewarpedNull.map((item) => (
                  <CheckInput
                    key={item.alarmAttachmentId}
                    type="checkbox"
                    label={`${item.deviceName}`}
                    name="checkboxGroup"
                    value={item.deviceId}
                    disabled={disabled}
                  />
                ))
              : null}
            {dewarpedQuad && dewarpedQuad.length >= 1
              ? dewarpedQuad.map((item) => (
                  <>
                    <div className="dewarped-options" key={item.deviceId + 2}>
                      {/* <CheckInput
                      type="checkbox"
                      label={`Video 2`}
                      name="checkboxGroup"
                      key={item.alarmAttachmentId}
                      value={item.deviceId}
                      disabled={disabled}
                    /> */}
                      <p>{item.deviceName}</p>

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
                    {/* Quads */}
                    <div style={{ display: show }}>
                      {dewarpedQuad && dewarpedQuad.length >= 1
                        ? [1, 2, 3, 4].map((quad) => (
                            <CheckInput
                              type="checkbox"
                              label={`Cuadrante ${quad}`}
                              name="checkboxGroup"
                              key={quad + 1}
                              value={`${item.deviceId}-${quad}`}
                              disabled={disabled}
                            />
                          ))
                        : null}
                    </div>
                  </>
                ))
              : null}

            {dewarpedDouble && dewarpedDouble.length >= 1
              ? dewarpedDouble.map((item) => (
                  <>
                    <div className="dewarped-options" key={item.deviceId + 2}>
                      {/* <CheckInput
                      type="checkbox"
                      label={`Video ${+1}`}
                      name="checkboxGroup"
                      key={item.alarmAttachmentId}
                      value={item.deviceId}
                      disabled={disabled}
                    /> */}
                      <p>{item.deviceName}</p>
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
                    {/* Double */}
                    <div style={{ display: show }}>
                      {dewarpedDouble && dewarpedDouble.length >= 1
                        ? [1, 2].map((quad) => (
                            <CheckInput
                              type="checkbox"
                              label={`Cuadrante ${quad}`}
                              name="checkboxGroup"
                              key={quad + 1}
                              value={`${item.deviceId}-${quad}`}
                              disabled={disabled}
                            />
                          ))
                        : null}
                    </div>
                  </>
                ))
              : null}

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
              <Button
                variant="outline-light"
                onClick={onHide}
                disabled={disabled}
              >
                Cancelar
              </Button>

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
