import React from "react";
import Form from "react-bootstrap/Form";

const CheckInput = ({ ...props }) => {
  return (
    <Form>
      <Form.Check
        type={props.type}
        id={`default-${props.type}`}
        label={props.label}
      />
    </Form>
  );
};

export default CheckInput;
