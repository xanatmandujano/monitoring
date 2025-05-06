import React from "react";
//Formik
import { Form, Formik } from "formik";
//Bootstrap
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
//Icons
import { BsSearch } from "react-icons/bs";
import { BsEraser } from "react-icons/bs";
//Components
import TextFieldControl from "../../components/TextField/TextFieldControl";

const ControlBar = ({ ...props }) => {
  /*Search bar and refresh button*/

  const renderTooltip = (prps) => (
    <Tooltip id="button-tooltip" {...prps}>
      Borrar búsqueda
    </Tooltip>
  );

  const getCurrentTime = () => {
    let currentTime = new Date();
    let hour = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();

    let houtStr = new String(hour);
    if (houtStr.length === 1) {
      hour = "0" + hour;
    }

    let minStr = new String(minutes);
    if (minStr.length === 1) {
      minutes = "0" + minutes;
    }

    let strSec = new String(seconds);
    if (strSec.length === 1) {
      seconds = "0" + seconds;
    }

    let time = `${hour} : ${minutes}`;

    return time;
  };

  return (
    <div className="control-bar">
      <Formik initialValues={{ search: "" }} onSubmit={props.submit}>
        {(p) => (
          <Form className="search-field">
            <TextFieldControl
              name="search"
              type="text"
              value={p.values.search}
              onChange={p.handleChange}
              placeholder="Sucursal"
            />

            <Button variant="main" type="submit">
              <BsSearch />
            </Button>

            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <Button variant="transparency-second" onClick={props.clear}>
                <BsEraser />
              </Button>
            </OverlayTrigger>
          </Form>
        )}
      </Formik>
      <p style={{ color: "white" }}>
        Ultima actualización {`${getCurrentTime()}`}
      </p>
      <Button variant="main" onClick={() => window.location.reload()}>
        Actualizar
      </Button>
    </div>
  );
};

export default ControlBar;
