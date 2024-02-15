import React, { useState, useEffect, useRef } from "react";
//Redux
import { useDispatch } from "react-redux";
import { clearMessage } from "../../store/slices/messageSlice";

//Hub
import { getAlarmData } from "../../services/alarmsService";

import { Connector } from "../../signalr/signalr-connection";
//Components
import AlarmNotification from "../../components/AlarmNotification/AlarmNotification";

const NewAlarm = () => {
  const [show, setShow] = useState(false);
  const [alarm, setAlarm] = useState("");
  let [alarmCode, setAlarmCode] = useState("");
  const [notifications, setNotifications] = useState([]);
  const latestAlarm = useRef(null);
  latestAlarm.current = notifications;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
    const newConnection = Connector();
    if (newConnection) {
      newConnection
        .start()
        .then(() => {
          //console.log("Connected from New alarm");
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
