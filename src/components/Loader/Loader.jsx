import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loader = ({ ...props }) => {
  return (
    <>
      <Spinner
        as="span"
        animation="border"
        size={props.size}
        role="status"
        aria-hidden="true"
      />
      <span className="visually-hidden">Loading...</span>
    </>
  );
};

export default Loader;
