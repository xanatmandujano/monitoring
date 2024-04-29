import React from "react";
//Redux
import { useSelector } from "react-redux";
//React router
import { Navigate } from "react-router-dom";
//Components
import Login from "../views/Login/Login";

const Public = () => {
  const { isLoggedIn } = useSelector(
    (state) => state.persist.authState.authInfo
  );
  return !isLoggedIn ? <Login /> : <Navigate to="/alarms-panel" />;
};

export default Public;
