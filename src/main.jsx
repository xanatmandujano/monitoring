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
import Public from "./routes/Public.jsx";
import AlarmDetails from "./components/AlarmDetails/AlarmDetails";
import AlarmDetailsVideo from "./components/AlarmDetails/AlarmDetailsVideo";
import AlarmDetailsRtcp from "./components/AlarmDetails/AlarmDetailsRtcp.jsx";
import AlarmDetailsRtcpHistory from "./views/AlarmsHistory/AlarmDetailsRtcpHistory.jsx";
import AlarmDetailsVideoHistory from "./views/AlarmsHistory/AlarmDetailsVideoHistory.jsx";

const router = createHashRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Public />, errorElement: <ErrorPage /> },
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
                element: <AlarmDetailsVideoHistory />,
                errorElement: <ErrorPage />,
              },
            ],
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
