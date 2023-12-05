import React from "react";
import ReactDOM from "react-dom/client";

//React router dom
import { RouterProvider, createHashRouter } from "react-router-dom";
//Styles
import "./styles/styles.scss";
//Views
import Root from "./routes/Root.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
import Login from "./views/Login/Login";
import AlarmsPanel from "./views/AlarmsPanel/AlarmsPanel";
import TestElement from "./views/TestElement/TestElement.jsx";
import AlarmsHistory from "./views/AlarmsHistory/AlarmsHistory.jsx";
//Redux
import { Provider } from "react-redux";
import { store } from "./store/store";
import Private from "./routes/Private";
import AlarmDetails from "./components/AlarmDetails/AlarmDetails";
import AlarmDetailsVideo from "./components/AlarmDetails/AlarmDetailsVideo";
import FaceRecognitionAlarm from "./components/AlarmDetails/FaceRecognitionAlarm.jsx.jsx";

const router = createHashRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Login />, errorElement: <ErrorPage /> },
      {
        element: <Private />,
        errorElement: <ErrorPage />,
        children: [
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
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
