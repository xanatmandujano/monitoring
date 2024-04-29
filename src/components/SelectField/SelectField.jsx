import React from "react";
//Bootstrap
import Form from "react-bootstrap/Form";
//Formik
import { useField } from "formik";

const SelectField = ({ ...props }) => {
  const [field, meta] = useField(props.name);
  return (
    <Form.Group style={{ marginRight: "1rem" }}>
      <Form.Select
        {...props}
        {...field}
        isInvalid={meta.touched && !!meta.error}
        size="md"
        placeholder={props.placeholder}
        data-bs-theme="dark"
        type={props.type}
      ></Form.Select>
      {meta.error && meta.touched && (
        <Form.Control.Feedback type="invalid">
          {meta.error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default SelectField;
