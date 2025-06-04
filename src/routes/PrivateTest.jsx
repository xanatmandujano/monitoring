import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetMessagesQuery } from "../store/api/signalRApi";
//import { Connector } from "../signalr/signalr-connection";
import { USER_LOGOUT, REFRESH_TOKEN } from "../store/actions/authAction";
import NewAlarm from "../views/AlarmsPanel/NewAlarm";
//import DevicesStatusNotification from "../views/DevicesStatus/DevicesStatusNotification";

const PrivateTest = () => {
  const [connection, setConnection] = useState("");
  //const { idVideo } = useParams();
  //Redux
  const { isLoggedIn, userId, expiration } = useSelector(
    (state) => state.persist.authState.authInfo
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return isLoggedIn ? (
    <>
      {/* <NewAlarm /> */}
      {/* <DevicesStatusNotification /> */}
      {/* <Outlet connection={connection} /> */}
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateTest;
