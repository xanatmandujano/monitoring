import React from "react";
import ReactDOM from "react-dom/client";
//React router dom
import { RouterProvider, createHashRouter } from "react-router-dom";
//Styles
import "./styles/styles.scss";
//Views
import Root from "./routes/Root.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
import AlarmsPanel from "./views/AlarmsPanel/AlarmsPanel";
import AlarmsHistory from "./views/AlarmsHistory/AlarmsHistory.jsx";
//Redux
import { Provider } from "react-redux";
import { store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Private from "./routes/Private";
import PrivateTest from "./routes/PrivateTest.jsx";
import Public from "./routes/Public.jsx";
import AlarmDetails from "./components/AlarmDetails/AlarmDetails";
import AlarmDetailsVideo from "./components/AlarmDetails/AlarmDetailsVideo";
//import AlarmDetailsRtcp from "./components/AlarmDetails/AlarmDetailsRtcp.jsx";
//import AlarmDetailsRtcpHistory from "./views/AlarmsHistory/AlarmDetailsRtcpHistory.jsx";
import FaceRecognitionAlarm from "./components/AlarmDetails/FaceRecognitionAlarm.jsx.jsx";
import AlarmDetailsFRHistory from "./views/AlarmsHistory/AlarmDetailsFRHistory.jsx";
import AlarmDetailsVideoHistory from "./views/AlarmsHistory/AlarmDetailsVideoHistory.jsx";
import AlarmsDetailsHistory from "./views/AlarmsHistory/AlarmsDetailsHistory.jsx";
import UnauthorizedPage from "./components/ErrorPage/UnauthorizedPage.jsx";
import DevicesStatus from "./views/DevicesStatus/DevicesStatus.jsx";
import Dashboards from "./views/Dashboards/Dashboards.jsx";

const router = createHashRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Public />, errorElement: <ErrorPage /> },
      {
        element: <PrivateTest />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "na",
            element: <UnauthorizedPage />,
          },
          {
            path: "alarms-panel",
            element: <AlarmsPanel />,
            errorElement: <ErrorPage />,
            children: [
              {
                path: ":idVideo",
                element: <AlarmDetails />,
                errorElement: <ErrorPage />,
              },
              {
                path: "seproban/:idVideo",
                element: <AlarmDetailsVideo />,
                errorElement: <ErrorPage />,
              },
              {
                path: "whiteList/:idVideo",
                element: <FaceRecognitionAlarm />,
                errorElement: <ErrorPage />,
              },
              {
                path: "blackList/:idVideo",
                element: <FaceRecognitionAlarm />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "alarms-history",
            element: <AlarmsHistory />,
            errorElement: <ErrorPage />,
            children: [
              {
                path: ":idVideo",
                element: <AlarmsDetailsHistory />,
                errorElement: <ErrorPage />,
              },
              {
                path: "seproban/:idVideo",
                element: <AlarmDetailsVideoHistory />,
                errorElement: <ErrorPage />,
              },
              {
                path: "whiteList/:idVideo",
                element: <AlarmDetailsFRHistory />,
                errorElement: <ErrorPage />,
              },
              {
                path: "blackList/:idVideo",
                element: <AlarmDetailsFRHistory />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "divar-status",
            element: <DevicesStatus />,
            errorElement: <ErrorPage />,
          },
          {
            path: "dashboards",
            element: <Dashboards />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
]);

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </PersistGate>
  </React.StrictMode>
);
