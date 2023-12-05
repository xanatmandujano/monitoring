import React, { useState } from "react";
//Formik
import { Form, Formik } from "formik";
import * as yup from "yup";
//Components
import TextField from "../../components/TextField/TextField";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import SelectField from "../../components/SelectField/SelectField";
import { BsSearch } from "react-icons/bs";
import { Row, Col } from "react-bootstrap";

const SearchBar = ({ submit }) => {
  const [loader, setLoader] = useState(false);

  return (
    <Container>
      <Formik initialValues={{ search: "", filter: "" }} onSubmit={submit}>
        {(props) => (
          <Form className="search-bar">
            <TextField
              //label="Búsqueda"
              name="search"
              type="text"
              value={props.values.search}
              onChange={props.handleChange}
              placeholder="Búsqueda..."
            />

            <SelectField value={props.values.filter} name="filter">
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
    </Container>
  );
};

export default SearchBar;
