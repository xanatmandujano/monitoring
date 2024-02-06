import React, { useState, useEffect, useRef } from "react";
//Redux
import { useDispatch } from "react-redux";
import { clearMessage } from "../../store/slices/messageSlice";
import { useSelector } from "react-redux";
//Hub
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getAlarmData } from "../../services/alarmsService";
import url from "/config.json";
//Components
import AlarmNotification from "../../components/AlarmNotification/AlarmNotification";
import AlarmCard from "../../components/AlarmCard/AlarmCard";

const NewAlarm = () => {
  const [show, setShow] = useState(false);
  const [alarm, setAlarm] = useState("");
  let [alarmCode, setAlarmCode] = useState("");
  const [notifications, setNotifications] = useState([]);
  const latestAlarm = useRef(null);
  const hubUrl = url.server.apiUrl;
  //const { connection } = useSelector((state) => state.notifications);

  latestAlarm.current = notifications;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${hubUrl}/hubs/notifications`)
      .withAutomaticReconnect()
      .build();

    if (newConnection) {
      newConnection
        .start()
        .then(() => {
          console.log("Connected from New alarm");
        })
        .catch((e) => console.log(`Connection failed: ${e}`));

      newConnection.on("ReceiveMessage", (message) => {
        let newNotification = JSON.parse(message.message);
        if (Object.hasOwn(newNotification, "Code")) {
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
        }
      });
    }
  }, [dispatch]);

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
