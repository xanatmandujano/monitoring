import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Connector } from "../signalr/signalr-connection";
import { USER_LOGOUT, REFRESH_TOKEN } from "../store/actions/authAction";
import NewAlarm from "../views/AlarmsPanel/NewAlarm";

const PrivateTest = () => {
  const [connection, setConnection] = useState("");
  //const { idVideo } = useParams();
  //Redux
  const { isLoggedIn, userId, expiration } = useSelector(
    (state) => state.persist.authState.authInfo
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const newConnection = Connector();
    setConnection(newConnection);
    newConnection.start();

    // setTimeout(() => {
    //   if (isLoggedIn) {
    //     dispatch(REFRESH_TOKEN())
    //       .unwrap()
    //       .then((res) => {
    //         //console.log(res);
    //         window.location.reload();
    //       });
    //   }
    // }, 60_000);
  }, []);

  return isLoggedIn ? (
    <>
      <NewAlarm />
      <Outlet connection={connection} />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateTest;
