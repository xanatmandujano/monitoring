import React, { useState, useRef, useEffect } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../store/slices/messageSlice";
//Hub
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getAlarmData } from "../../services/alarmsService";
import AlarmCard from "../../components/AlarmCard/AlarmCard";
import { alarmNotificationHub } from "../../store/actions/notificationActions";

const NewAlarmCard = () => {
  const [show, setShow] = useState("none");
  const [alarm, setAlarm] = useState([]);
  //let [alarmCode, setAlarmCode] = useState("");
  const latestAlarm = useRef();
  latestAlarm.current = alarm;

  const dispatch = useDispatch();
  const { newAlarm } = useSelector((state) => state.notifications);

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
          console.log("Alarm card conected!");
          newConnection.on("ReceiveMessage", (message) => {
            let newAlarm = JSON.parse(message.message);
            let newAlarmCode = newAlarm.Code;

            const alarmData = async () => {
              try {
                const data = await getAlarmData(newAlarmCode).then((res) => {
                  if (res.data.isSuccess) {
                    const updatedAlarms = [...latestAlarm.current];
                    updatedAlarms.push(res.data.result);

                    let result = updatedAlarms.filter((item, index) => {
                      return (
                        updatedAlarms.indexOf(item.alarmId) === index.alarmId
                      );
                    });
                    console.log(result);

                    setAlarm(updatedAlarms);
                    setShow("block");
                  }
                });
              } catch (error) {
                console.log(error.message);
              }
            };

            alarmData();
          });
        })
        .catch((e) => console.log(`Connection failed: ${e}`));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(clearMessage());
  //   dispatch(
  //     alarmNotificationHub({
  //       url: "https://192.168.1.120:8091/hubs/notifications",
  //     })
  //   ).then(() => {
  //     setShow("block");
  //   });
  // }, [dispatch, newAlarm]);

  const alarmType = (alarmTypeId, alarmId) => {
    if (alarmTypeId === 1) {
      return `seproban/${alarmId}`;
    } else if (alarmTypeId === 2) {
      return alarmId;
    }
  };

  return (
    <>
      {alarm &&
        alarm.map((item) => (
          <AlarmCard
            key={item.alarmId + 1}
            alarmCode={item.alarmCode}
            alarmIcon={item.alarmTypeIcon}
            alarmDescription={item.alarmDescription}
            locationInfo={item.locationInfo}
            deviceCode={item.deviceCode}
            deviceIPAddress={item.deviceIPAddress}
            creationDate={item.creationDate}
            alarmParams={alarmType(item.alarmTypeId, item.alarmId)}
            display={{ display: show }}
          />
        ))}

      {/* {alarm && (
        <AlarmCard
          key={alarm.alarmId}
          alarmCode={alarm.alarmCode}
          alarmIcon={alarm.alarmTypeIcon}
          alarmDescription={alarm.alarmDescription}
          locationInfo={alarm.locationInfo}
          deviceCode={alarm.deviceCode}
          deviceIPAddress={alarm.deviceIPAddress}
          creationDate={alarm.creationDate}
          alarmParams={alarmType(alarm.alarmTypeId, alarm.alarmId)}
          display={{ display: show }}
        />
      )} */}
    </>
  );
};

export default NewAlarmCard;
