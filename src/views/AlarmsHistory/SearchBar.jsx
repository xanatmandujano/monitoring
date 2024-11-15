import React, { useState } from "react";
//Formik
import { Form, Formik } from "formik";
import FormikObserver from "../../components/FormikObserver/FormikObserver";
//Components
import TextFieldControl from "../../components/TextField/TextFieldControl";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Button from "react-bootstrap/Button";
import SelectField from "../../components/SelectField/SelectField";
import { BsSearch } from "react-icons/bs";
import { BsEraser } from "react-icons/bs";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const SearchBar = ({ submit }) => {
  const [placeholder, setPlaceholder] = useState("");
  const [type, setType] = useState("text");
  const [statusFilter, setStatusFilter] = useState("status");
  const [isEvent, setIsEvent] = useState(null);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Borrar búsqueda
    </Tooltip>
  );

  return (
    <>
      <Formik
        initialValues={{ search: "", filter: "", isEvent: isEvent }}
        onSubmit={submit}
      >
        {(props) => (
          <Form className="search-field">
            <FormikObserver
              onChange={(values, initialValues) => {
                if (values.values.filter === "creationDate") {
                  setIsEvent(null);
                  setStatusFilter("");
                  setPlaceholder("aaaa/mm/dd");
                  setType("date");
                } else if (values.values.filter === "status") {
                  setIsEvent(null);
                  values.values.search = "";
                  setStatusFilter("status");
                } else if (values.values.filter === "isEvent") {
                  values.values.search = "";
                  setStatusFilter("isEvent");
                  if (values.values.search === "Alarma") {
                    setIsEvent(false);
                  } else if (values.values.search === "Evento") {
                    setIsEvent(true);
                  } else {
                    setIsEvent(null);
                  }
                } else {
                  setIsEvent(null);
                  setStatusFilter("");
                  setPlaceholder("Búsqueda...");
                  setType("text");
                }
              }}
            />
            {statusFilter === "status" ? (
              <SelectField
                name="search"
                value={props.values.search}
                onChange={props.handleChange}
                aria-label="Default select example"
              >
                <option> </option>
                <option>Creada</option>
                <option>Vista</option>
                <option>Validada</option>
                <option>Descartada</option>
                <option value="Envio cancelado">Cancelada</option>
              </SelectField>
            ) : statusFilter === "isEvent" ? (
              <SelectField
                name="isEvent"
                value={props.values.isEvent}
                onChange={props.handleChange}
              >
                <option> </option>
                {/* <option value={null}>Todas</option> */}
                <option value={false}>Alarma</option>
                <option value={true}>Evento</option>
              </SelectField>
            ) : (
              <TextFieldControl
                name="search"
                type={type}
                value={props.values.search}
                onChange={props.handleChange}
                placeholder={placeholder}
              />
            )}

            <SelectField
              value={props.values.filter}
              name="filter"
              onChange={props.handleChange}
              aria-label="Default select example"
            >
              <option value="">--Selecciona--</option>
              <option value="additionalInformation">Placa</option>
              <option value="isEvent">Tipo</option>
              <option value="creationDate">Fecha</option>
              <option value="alarmCode">Código</option>
              <option value="branchName">Sucursal</option>
              <option value="deviceName">Sensor</option>
              <option value="status">Estatus</option>
            </SelectField>

            <Button variant="main" type="submit">
              <BsSearch />
            </Button>

            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <Button
                variant="transparency-second"
                onClick={() => window.location.reload()}
              >
                <BsEraser />
              </Button>
            </OverlayTrigger>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SearchBar;
