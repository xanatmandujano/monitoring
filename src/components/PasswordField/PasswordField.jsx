import React, { useState } from "react";
//Bootstrap
import Form from "react-bootstrap/Form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
//Formik
import { useField } from "formik";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

const PasswordField = ({ ...props }) => {
  const [field, meta] = useField(props.name);
  const [showPass, setShowPass] = useState("password");

  const handleOnClick = (e) => {
    e.preventDefault();
    if (showPass === "password") {
      setShowPass("text");
    } else {
      setShowPass("password");
    }
  };

  return (
    <Form.Group className="password-field" data-bs-theme="dark">
      <Form.Label htmlFor={field.name}>{props.label}</Form.Label>
      <Form.Control
        {...field}
        {...props}
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
        isInvalid={meta.touched && !!meta.error}
        type={showPass}
      />
      <Button size="sm" onClick={handleOnClick} className="btn-eye">
        {showPass === "password" ? <FaRegEyeSlash /> : <FaRegEye />}
      </Button>
      {meta.error && meta.touched && (
        <Form.Control.Feedback type="invalid">
          {props.errors}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default PasswordField;
