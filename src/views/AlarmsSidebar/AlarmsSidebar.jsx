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
  const [path, setPath] = useState("");

  const { alarmNotification, alarms, alarmsCount } = useSelector(
    (state) => state.alarms
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(todayAlarms({ pageNumber: 1, pageSize: 25 }))
      .unwrap()
      .then(() => {
        console.log("Today alarms succedded");
      });
  }, [dispatch]);

  const alarmType = (alarmTypeId, alarmId) => {
    if (alarmTypeId === 1) {
      return `seproban/${alarmId}`;
    } else if (alarmTypeId === 2) {
      return alarmId;
    }
  };

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
            alarmParams={alarmType(item.alarmTypeId, item.alarmId)}
          />
        ))}
    </Container>
  );
};

export default AlarmsSidebar;
