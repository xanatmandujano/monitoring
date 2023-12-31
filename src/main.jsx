import React from "react";
import ReactDOM from "react-dom/client";
//import "./index.css";
//React router dom
import { RouterProvider, createHashRouter } from "react-router-dom";
//Styles
import "./styles/styles.scss";
//import "bootstrap/dist/css/bootstrap.min.css";
//Views
import Root from "./routes/Root.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
import Login from "./views/Login/Login";
import AlarmsPanel from "./views/AlarmsPanel/AlarmsPanel";
//Redux
import { Provider } from "react-redux";
import { store } from "./store/store";
import Private from "./routes/Private";

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
