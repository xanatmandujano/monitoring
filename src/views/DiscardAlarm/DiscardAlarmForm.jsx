import React, { useState, useEffect } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { alarmStatus } from "../../store/actions/alarmsActions";
//React-router-dom
import { useNavigate } from "react-router-dom";
import { Connector } from "../../signalr/signalr-connection";
//Components
import TextFieldArea from "../../components/TextField/TextFieldArea";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Loader from "../../components/Loader/Loader";

const DiscardAlarmForm = ({ onHide }) => {
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [connection, setConnection] = useState(null);
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();
  const { alarmFiles } = useSelector((state) => state.attachments);
  const navigate = useNavigate();

  useEffect(() => {
    const newConnection = Connector();
    setConnection(newConnection);
    newConnection.start();
  }, []);

  const sendAlarmStatus = async () => {
    const chatMessage = {
      user: sessionStorage.getItem("userId"),
      message: JSON.stringify({
        action: "discarded",
        alarmId: alarmFiles.alarmId,
      }),
    };
    try {
      if (connection) {
        await connection.send("SendToAll", chatMessage).then(() => {
          console.log("Message sent");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        sendAlarmStatus();
        navigate("/alarms-panel");
        //window.location.reload();
      })
      .catch(() => {
        setLoader(false);
        setDisabled(false);
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
