import React, { useState, useEffect, useRef } from "react";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { alarmData } from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
import {
  setAlarmNotification,
  setNewAlarm,
} from "../../store/slices/alarmsSlice";
//Hub
import { HubConnectionBuilder } from "@microsoft/signalr";
//Components
import AlarmNotification from "../../components/AlarmNotification/AlarmNotification";
import Container from "react-bootstrap/Container";
import { getAlarmData } from "../../services/alarmsService";

const NewAlarm = () => {
  const [show, setShow] = useState(false);
  const [alarm, setAlarm] = useState("");
  let [alarmCode, setAlarmCode] = useState("");
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
  //       const newAlarmCode = alarmNotification && alarmNotification.Code;
  //       const updatedAlarms = [...latestAlarm.current];
  //       console.log(alarmInfo);
  //       console.log(newAlarmCode);
  //       setShow(true);
  //       setAlarm(updatedAlarms);
  //     });
  // }, [dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://192.168.1.120:8091/hubs/notifications")
      .withAutomaticReconnect()
      .build();

    if (newConnection) {
      newConnection
        .start()
        .then(() => {
          console.log("Conected!");
        })
        .catch((e) => console.log(`Connection failed: ${e}`));

      newConnection.on("ReceiveMessage", (message) => {
        let newAlarm = JSON.parse(message.message);
        let newAlarmCode = newAlarm.Code;

        const alarmData = async () => {
          try {
            const data = await getAlarmData(newAlarmCode).then((res) => {
              if (res.data.isSuccess) {
                setAlarmCode(newAlarmCode);
                setAlarm(res.data.result);
                setShow(true);
              }
            });
          } catch (error) {
            console.log(error.message);
          }
        };

        alarmData();
      });
    }
  }, []);

  return (
    <>
      <AlarmNotification
        alarmData={`${alarmCode} - ${alarm.alarmDescription}`}
        hideToast={() => setShow(false)}
        toastShow={show}
      />
    </>
  );
};

export default NewAlarm;
