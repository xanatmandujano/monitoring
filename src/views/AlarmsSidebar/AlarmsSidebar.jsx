import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  alarmNotificationHub,
  todayAlarms,
} from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
//Bootstrap
import Container from "react-bootstrap/Container";
//Components
import AlarmCard from "../../components/AlarmCard/AlarmCard";

const AlarmsSidebar = () => {
  const [alarm, setAlarm] = useState([]);
  const latestAlarm = useRef(null);
  latestAlarm.current = alarm;

  const { alarmNotification, alarms, alarmsCount, alarmInfo } = useSelector(
    (state) => state.alarms
  );
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(
      alarmNotificationHub({
        url: "https://192.168.1.120:8091/hubs/notifications",
      })
    )
      .unwrap()
      .then(() => {
        //Change this logic
        // const newAlarmCode = alarmNotification.Code;
        // const updatedAlarms = [...latestAlarm.current];
        // setAlarm(updatedAlarms);
        console.log(alarmInfo);
      });
    dispatch(todayAlarms({ pageNumber: 1, pageSize: 50 }))
      .unwrap()
      .then(() => {
        console.log(alarms);
        console.log("Today alarms succedded");
      });
  }, []);

  // useEffect(() => {
  //   const newAlarmCode = alarmNotification.Code;
  //   console.log(newAlarmCode);
  //   if (alarmNotification.Code) {
  //     dispatch(alarmData({ code: newAlarmCode }))
  //       .unwrap()
  //       .then(() => {
  //         console.log(alarmInfo);
  //       });
  //   }
  // }, [alarmNotification.Code]);

  //latestAlarm.current = alarm;

  //Hub connection
  // useEffect(() => {
  //   const newConnection = new HubConnectionBuilder()
  //     .withUrl("https://192.168.1.120:8091/hubs/notifications")
  //     .withAutomaticReconnect()
  //     .build();

  //   if (newConnection) {
  //     newConnection
  //       .start()
  //       .then(() => {
  //         console.log("Conected!");
  //       })
  //       .catch((e) => console.log(`Connection failed: ${e}`));

  //     newConnection.on("ReceiveMessage", (message) => {
  //       setAlarm(message.message);
  //     });
  //   }
  //   console.log(alarm);
  // }, [alarm]);

  return (
    <Container>
      {alarms &&
        alarms.map((item) => (
          <AlarmCard
            alarmCode={item.alarmCode}
            alarmDescription={item.alarmDescription}
            locationInfo={item.locationInfo}
            deviceCodeIPAddress={item.deviceCodeIPAddress}
            creationDate={item.creationDate}
          />
        ))}
    </Container>
  );
};

export default AlarmsSidebar;
