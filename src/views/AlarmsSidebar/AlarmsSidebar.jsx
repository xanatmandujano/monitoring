import React, { useState, useEffect, useRef } from "react";
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
    // dispatch(
    //   alarmNotificationHub({
    //     url: "https://192.168.1.120:8091/hubs/notifications",
    //   })
    // )
    //   .unwrap()
    //   .then(() => {
    //     //Change this logic
    //     // const newAlarmCode = alarmNotification.Code;
    //     // const updatedAlarms = [...latestAlarm.current];
    //     // setAlarm(updatedAlarms);
    //     console.log(alarmInfo);
    //   });
    dispatch(todayAlarms({ pageNumber: 1, pageSize: 100 }))
      .unwrap()
      .then(() => {
        console.log(alarms);
        console.log("Today alarms succedded");
      });
  }, []);

  return (
    <Container className="alarms-side-bar">
      {alarms &&
        alarms.map((item) => (
          <AlarmCard
            key={item.alarmId}
            alarmCode={item.alarmCode}
            alarmIcon={item.alarmTypeIcon}
            alarmDescription={item.alarmDescription}
            locationInfo={item.locationInfo}
            deviceCodeIPAddress={item.deviceCodeIPAddress}
            creationDate={item.creationDate}
            alarmParams={`${item.alarmId}`}
          />
        ))}
    </Container>
  );
};

export default AlarmsSidebar;
