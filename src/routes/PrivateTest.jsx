import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Connector } from "../signalr/signalr-connection";
import NewAlarm from "../views/AlarmsPanel/NewAlarm";

const PrivateTest = () => {
  const [connection, setConnection] = useState("");
  //Redux
  const { isLoggedIn, userId, expiration } = useSelector(
    (state) => state.persist.authState.authInfo
  );

  useEffect(() => {
    const newConnection = Connector();
    setConnection(newConnection);
    newConnection.start();
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
