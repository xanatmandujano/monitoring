import React from "react";
//Bootstrap
import Form from "react-bootstrap/Form";
//Formik
import { useField } from "formik";

const TextFieldArea = ({ ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <Form.Group className="text-field" data-bs-theme="dark">
      <Form.Label htmlFor={field.name} className="form-label">
        {props.label}
      </Form.Label>
      <Form.Control
        {...field}
        {...props}
        as="textarea"
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

export default TextFieldArea;
