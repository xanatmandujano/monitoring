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
  const [statusFilter, setStatusFilter] = useState(false);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Borrar búsqueda
    </Tooltip>
  );

  return (
    <>
      <Formik initialValues={{ search: "", filter: "" }} onSubmit={submit}>
        {(props) => (
          <Form className="search-field">
            <FormikObserver
              onChange={(values, initialValues) => {
                if (values.values.filter === "creationDate") {
                  setStatusFilter(false);
                  setPlaceholder("aaaa/mm/dd");
                  setType("date");
                } else if (values.values.filter === "status") {
                  setStatusFilter(true);
                } else {
                  setStatusFilter(false);
                  setPlaceholder("Búsqueda...");
                  setType("text");
                }
              }}
            />
            {statusFilter ? (
              <SelectField
                name="search"
                value={props.values.search}
                onChange={props.handleChange}
                aria-label="Default select example"
              >
                <option>Creada</option>
                <option>Vista</option>
                <option>Validada</option>
                <option>Descartada</option>
                <option value="Envio cancelado">Cancelada</option>
                <option>Reactivada</option>
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
              <option value="creationDate">Fecha</option>
              <option value="alarmCode">Código de alarma</option>
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
