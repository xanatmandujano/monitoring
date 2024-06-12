import React from "react";
import Form from "react-bootstrap/Form";
//Formik
import { useField } from "formik";

const CheckInput = ({ ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <Form.Group>
      <Form.Check
        {...field}
        {...props}
        htmlFor={field.name}
        type={props.type}
        id={`default-${props.type}-${props.value}`}
        label={props.label}
        style={{ color: "#fff" }}
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

export default CheckInput;
