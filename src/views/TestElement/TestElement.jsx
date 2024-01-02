import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const TestElement = () => {
  const dispatch = useDispatch();
  const { newAlarm } = useSelector((state) => state.notifications);
  useEffect(() => {
    console.log(newAlarm);
  }, [newAlarm]);

  return (
    <div>
      <p>{newAlarm}</p>
    </div>
  );
};

export default TestElement;
