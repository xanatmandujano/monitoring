import React, { useState, useEffect, useRef } from "react";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { alarmNotificationHub } from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
//Components
import AlarmNotification from "../../components/AlarmNotification/AlarmNotification";
import Container from "react-bootstrap/Container";

//Dispatch notification

const NewAlarm = () => {
  const [show, setShow] = useState(true);
  const [alarm, setAlarm] = useState([]);
  const latestAlarm = useRef();
  latestAlarm.current = alarm;

  const dispatch = useDispatch();
  const { alarmNotification, alarmInfo } = useSelector((state) => state.alarms);

  // useEffect(() => {
  //   dispatch(clearMessage());
  //   dispatch(
  //     alarmNotificationHub({
  //       url: "https://192.168.1.120:8091/hubs/notifications",
  //     })
  //   )
  //     .unwrap()
  //     .then(() => {
  //       const newAlarmCode = alarmNotification.Code;
  //       const updatedAlarms = [...latestAlarm.current];
  //       console.log(alarmInfo);
  //       console.log(newAlarmCode);
  //       setAlarm(updatedAlarms);
  //     });
  // }, [dispatch]);

  return (
    <>
      {/* {alarm ? (
        <AlarmNotification
          alarmData={alarmInfo}
          onClose={() => setShow(false)}
          toastShow={show}
        />
      ) : null} */}
      <AlarmNotification
        alarmData={alarmInfo}
        hideToast={() => setShow(false)}
        toastShow={show}
      />
    </>
  );
};

export default NewAlarm;
