import React, { useEffect, useState, useRef } from "react";
//Formik & yup
import { Form, Formik } from "formik";
import * as yup from "yup";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { validateSeprobanAlarm } from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
import { useSendMessageToAllMutation } from "../../store/api/signalRApi";
//React-router-dom
import { useNavigate } from "react-router-dom";
//Components
import TextFieldArea from "../../components/TextField/TextFieldArea";
import TextField from "../../components/TextField/TextField";
import CheckInput from "../../components/CheckInput/CheckInput";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Loader from "../../components/Loader/Loader";
import FormikObserver from "../../components/FormikObserver/FormikObserver";
import CanceledAlarm from "../../components/AlarmNotification/CanceledAlarm";

const AcceptAlarmForm = () => {
  //State
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [cancelBtn, setCancelBtn] = useState(true);
  const [sendBtn, setSendBtn] = useState(false);
  const [checked, setChecked] = useState(null);
  const abortControllerRef = useRef(new AbortController());

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sendMessageToAll] = useSendMessageToAllMutation();
  const { alarmFiles } = useSelector((state) => state.attachments);
  const { userName, userId } = useSelector(
    (state) => state.persist.authState.authInfo
  );

  useEffect(() => {
    dispatch(clearMessage(""));
  }, []);

  const sendAlarmStatus = async (action) => {
    const viewAction = {
      user: sessionStorage.getItem("userId"),
      message: JSON.stringify({
        action: action,
        alarmId: alarmFiles.alarmId,
      }),
    };

    await sendMessageToAll(viewAction).unwrap();
  };

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

  const handleShow = (id) => {
    let quads = document.getElementById(id);
    if (quads && quads.style.display === "none") {
      //console.log(quads.style.display);
      quads.style.display = "block";
    } else if (quads && quads.style.display === "block") {
      quads.style.display = "none";
    }
  };

  const handleTime = () => {
    const date = new Date();
    const locale = date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    return locale;
  };

  //Accept alarm
  const sendAlarm = (values) => {
    setLoader(true);
    setDisabled(true);
    setSendBtn(true);
    setCancelBtn(false);
    const element = document.getElementById("accept-alarm-header");
    element.lastChild.style.display = "none";

    const body = {
      alarmId: alarmFiles && alarmFiles.alarmId,
      comments: values.comments,
      alarmUser: values.user,
      alarmTime: values.time,
      devices: values.checkboxGroup ? values.checkboxGroup : [],
      allDevices: values.toggle ? values.toggle : null,
      signal: abortControllerRef.current.signal,
    };

    dispatch(validateSeprobanAlarm(body))
      .unwrap()
      .then(() => {
        setLoader(false);
        setDisabled(false);
        sendAlarmStatus("accepted");
        navigate("/alarms-panel");
      })
      .catch(() => {
        setLoader(false);

        if (abortControllerRef.current.signal.aborted) {
          setShow(true);
          setDisabled(true);
          setCancelBtn(true);
          sendAlarmStatus("discarded");
          element.lastChild.style.display = "block";
          navigate("/alarms-panel");
        }
      });
  };

  //Cancel send alarm
  const handleCancel = () => {
    abortControllerRef.current.abort();
  };

  const validationSchema = yup.object().shape({
    comments: yup.string().required("yup.comments"),
    //user: yup.string().required("yup.user"),
    //time: yup.string().required("yup.time"),
    //checkboxGroup: yup.array().min(1).required(),
  });

  return (
    <Container className="accept-alarm-form">
      <CanceledAlarm hideToast={() => setShow(false)} toastShow={show} />
      <Formik
        initialValues={{
          comments: "",
          user: `${userName}`,
          time: `${handleTime()}`,
          checkboxGroup: [],
          toggle: false,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          JSON.stringify(values);
          sendAlarm(values);
        }}
      >
        {(props) => (
          <Form>
            <FormikObserver
              onChange={(values, initialValues) => {
                if (values.values.toggle) {
                  setChecked(true);
                } else if (!values.values.toggle) {
                  setChecked(null);
                }
              }}
            />

            <p>Selección de videos</p>
            {/*Select all*/}
            <CheckInput
              type="switch"
              label={`Seleccionar todo`}
              name="toggle"
              onClick={() => {
                props.setFieldValue("checkboxGroup", [], true);
              }}
              value={props.values.toggle}
            />

            {/* Devices */}
            {dewarpedNull && dewarpedNull.length >= 1
              ? dewarpedNull.map((item) => (
                  <CheckInput
                    key={item.deviceId}
                    type="checkbox"
                    label={`${item.deviceName}`}
                    name="checkboxGroup"
                    value={item.deviceId}
                    disabled={disabled}
                    checked={checked}
                    id={item.deviceId}
                  />
                ))
              : null}
            {dewarpedQuad && dewarpedQuad.length >= 1
              ? dewarpedQuad.map((item) => (
                  <div key={item.deviceId}>
                    <div className="dewarped-options">
                      <p key={item.deviceId + 1}>{item.deviceName}</p>

                      <Button
                        variant="main"
                        onClick={() => handleShow(item.deviceId)}
                        size="sm"
                        disabled={disabled}
                      >
                        +
                      </Button>
                    </div>
                    {/* Quads */}
                    <div
                      style={{ display: "none" }}
                      key={item.deviceId + 3}
                      id={item.deviceId}
                    >
                      {/* {dewarpedQuad && dewarpedQuad.length >= 1
                        ? [1, 2, 3, 4].map((quad) => (
                            <CheckInput
                              type="checkbox"
                              label={`Cuadrante ${quad}`}
                              name="checkboxGroup"
                              key={quad + 1}
                              value={`${item.deviceId}-${quad}`}
                              disabled={disabled}
                              checked={checked}
                              id={item.deviceId}
                            />
                          ))
                        : null} */}
                      {item.quadrants.map((q, index) => (
                        <CheckInput
                          type="checkbox"
                          label={q}
                          name="checkboxGroup"
                          key={q + 1}
                          value={`${item.deviceId}-${index + 1}`}
                          disabled={disabled}
                          checked={checked}
                          id={item.deviceId}
                        />
                      ))}
                    </div>
                  </div>
                ))
              : null}

            {dewarpedDouble && dewarpedDouble.length >= 1
              ? dewarpedDouble.map((item) => (
                  <div key={item.deviceId}>
                    <div className="dewarped-options" key={item.deviceId}>
                      <p key={item.deviceId + 1}>{item.deviceName}</p>
                      <Button
                        variant="main"
                        onClick={() => handleShow(item.deviceId)}
                        size="sm"
                        disabled={disabled}
                      >
                        +
                      </Button>
                    </div>
                    {/* Double */}
                    <div
                      style={{ display: "none" }}
                      key={item.deviceId + 3}
                      id={item.deviceId}
                    >
                      {/* {dewarpedDouble && dewarpedDouble.length >= 1
                        ? [1, 2].map((quad) => (
                            <CheckInput
                              type="checkbox"
                              label={`Cuadrante ${quad}`}
                              name="checkboxGroup"
                              key={quad + 1}
                              value={`${item.deviceId}-${quad}`}
                              disabled={disabled}
                              checked={checked}
                              //id={item.deviceId}
                            />
                          ))
                            
                        : null} */}
                      {item.quadrants.map((q, index) => (
                        <CheckInput
                          type="checkbox"
                          label={q}
                          name="checkboxGroup"
                          key={q + 1}
                          value={`${item.deviceId}-${index + 1}`}
                          disabled={disabled}
                          checked={checked}
                          id={item.deviceId}
                        />
                      ))}
                    </div>
                  </div>
                ))
              : null}

            {/* <TextField
              label="Usuario"
              name="user"
              type="text"
              value={props.values.user}
              onChange={props.handleChange}
              errors="Escriba un nombre de usuario"
              placeholder="Usuario 1"
            />
            <TextField
              label="Hora del envío"
              name="time"
              type="time"
              value={props.values.time}
              onChange={props.handleChange}
              errors="Seleccione una hora"
            /> */}

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
                onClick={handleCancel}
                disabled={cancelBtn}
              >
                Cancelar
              </Button>

              <Button variant="main" type="submit" disabled={sendBtn}>
                Aceptar {loader ? <Loader variant="light" size="sm" /> : null}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AcceptAlarmForm;
