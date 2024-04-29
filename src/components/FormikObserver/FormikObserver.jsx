import React, { useEffect } from "react";
import { useFormikContext } from "formik";

const FormikObserver = ({ onChange }) => {
  const { values, initialValues } = useFormikContext();

  useEffect(
    () => onChange({ values, initialValues }),
    [values, initialValues, onChange]
  );

  return null;
};

export default FormikObserver;
