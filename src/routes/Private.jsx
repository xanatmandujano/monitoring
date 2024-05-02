import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IdleTimerProvider, useIdleTimerContext } from "react-idle-timer";
import { USER_LOGOUT, REFRESH_TOKEN } from "../store/actions/authAction";
import ModalMessage from "../components/ModalMessage/ModalMessage";
import { Connector } from "../signalr/signalr-connection";

const expirationTime = 3600 * 1000;
const promptBeforeIdle = 10_000;
//const promptBeforeIdle = 5;

function Child() {
  const { getRemainingTime } = useIdleTimerContext();
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    //Idle timer
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0);
  const seconds = timeTillPrompt > 1 ? "seconds" : "second";

  // if (timeTillPrompt > 0) {
  //   console.log(`${timeTillPrompt} ${seconds}`);
  // }

  return null;
}

function Prompt({ show }) {
  const [remaining, setRemaining] = useState(0);
  const { activate, getRemainingTime } = useIdleTimerContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ModalMessage
      show={show}
      onHide={activate}
      headermessage="La sesión finalizará"
      message={`Tiempo restante ${remaining} segundos`}
      btntext={"Continuar sesión"}
      onClick={activate}
    />
  );
}

const Private = () => {
  const [state, setState] = useState("Active");
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [connection, setConnection] = useState("");
  const { idVideo } = useParams();

  useEffect(() => {
    const newConnection = Connector();
    setConnection(newConnection);
    newConnection.start();
  }, []);
  //Redux
  const { isLoggedIn, userId, expiration } = useSelector(
    (state) => state.persist.authState.authInfo
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          console.log("Alarm release: idle");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Idle timer
  const onPresenceChange = (PresenceType) => {
    const isIdle = PresenceType.type === "idle";
    const isPrompted = PresenceType.type === "active" && PresenceType.prompted;
    const isActive = PresenceType.type === "active" && PresenceType.prompted;

    console.log(isActive);
  };

  const onPrompt = () => {
    setState("Prompted");
    setOpen(true);
  };

  const onIdle = () => {
    setState("Idle");
    setOpen(false);
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

  const onActive = () => {
    setState("Active");
    setOpen(false);
    console.log(state);
  };

  const onAction = () => {
    setCount(count + 1);
  };

  //Expiration token
  const dateTime = new Date(expiration);
  const currentDate = new Date();

  const convertTime = (time) => {
    const getHours = time.getHours() * 3600;
    const getMinutes = time.getMinutes() * 60;
    const getSeconds = time.getSeconds();

    const sum = getHours + getMinutes + getSeconds;
    const milSec = sum * 1000;
    return milSec;
  };

  useEffect(() => {
    const tokenMilSec = convertTime(dateTime);
    const currMilSec = convertTime(currentDate);
    const res = tokenMilSec - currMilSec;
    //const res = 20_000;
    setTimeout(() => {
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
    }, 86_400_000);
  }, []);

  return isLoggedIn ? (
    <IdleTimerProvider
      timeout={expirationTime}
      promptBeforeIdle={promptBeforeIdle}
      throttle={500}
      onPresenceChange={onPresenceChange}
      onIdle={onIdle}
      onPrompt={onPrompt}
      onActive={onActive}
      onAction={onAction}
    >
      <Child />
      <Prompt show={open} onHide={() => setOpen} />
      <Outlet connection={connection} />
    </IdleTimerProvider>
  ) : (
    <Navigate to="/" />
  );

  //return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default Private;
