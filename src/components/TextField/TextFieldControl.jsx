import React from "react";
//Bootstrap
import Form from "react-bootstrap/Form";
//Formik
import { useField } from "formik";

const TextFieldControl = ({ ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <Form.Group data-bs-theme="dark" style={{ marginRight: "1rem" }}>
      <Form.Control
        {...field}
        {...props}
        isInvalid={meta.touched && !!meta.error}
      />
      {meta.error && meta.touched && (
        <Form.Control.Feedback type="invalid">
          {props.errors}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default TextFieldControl;
