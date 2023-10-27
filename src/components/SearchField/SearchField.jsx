import React from "react";
//Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BsSearch } from "react-icons/bs";

const SearchField = ({ ...props }) => {
  return (
    <div className="search-field">
      <Form.Control
        type="text"
        placeholder="Buscar alarma"
        size="sm"
        data-bs-theme="dark"
        onChange={props.changeEvent}
        disabled={props.disabled}
      />
      <Button variant="main" size="sm">
        <BsSearch />
      </Button>
    </div>
  );
};

export default SearchField;
