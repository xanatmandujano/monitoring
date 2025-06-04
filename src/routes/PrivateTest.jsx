import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NewAlarm from "../views/AlarmsPanel/NewAlarm";
import DevicesStatusNotification from "../views/DevicesStatus/DevicesStatusNotification";

const PrivateTest = () => {
  //const { idVideo } = useParams();
  //Redux
  const { isLoggedIn, userId, expiration } = useSelector(
    (state) => state.persist.authState.authInfo
  );

  return isLoggedIn ? (
    <>
      <NewAlarm />
      <DevicesStatusNotification />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateTest;
