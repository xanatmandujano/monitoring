import React, { useState } from "react";
//Formik
import { Form, Formik } from "formik";
import * as yup from "yup";
import FormikObserver from "../../components/FormikObserver/FormikObserver";
//Components
import TextFieldControl from "../../components/TextField/TextFieldControl";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Button from "react-bootstrap/Button";
import SelectField from "../../components/SelectField/SelectField";
import { BsSearch } from "react-icons/bs";

const SearchBar = ({ submit }) => {
  const [placeholder, setPlaceholder] = useState("");
  return (
    <>
      <Formik initialValues={{ search: "", filter: "" }} onSubmit={submit}>
        {(props) => (
          <Form className="search-field">
            <FormikObserver
              onChange={(values, initialValues) => {
                if (values.values.filter === "creationDate") {
                  setPlaceholder("aaaa/mm/dd");
                } else {
                  setPlaceholder("Búsqueda...");
                }
              }}
            />
            <TextFieldControl
              name="search"
              type="text"
              value={props.values.search}
              onChange={props.handleChange}
              placeholder={placeholder}
            />

            <SelectField
              value={props.values.filter}
              name="filter"
              onChange={props.handleChange}
              aria-label="Default select example"
            >
              <option value="">--Selecciona--</option>
              <option value="creationDate">Fecha</option>
              <option value="branchCode">Clave de sucursal</option>
              <option value="deviceIPAddress">IP del panel</option>
              <option value="status">Estatus</option>
            </SelectField>

            <Button variant="main" type="submit">
              <BsSearch />
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SearchBar;
