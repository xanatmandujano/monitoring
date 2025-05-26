import React, { useState, useEffect, useRef } from "react";
//Redux
import { useDispatch } from "react-redux";
import { clearMessage } from "../../store/slices/messageSlice";
import { hasPermission } from "../../services/authService";
//Hub
import { getAlarmData } from "../../services/alarmsService";
import { Connector } from "../../signalr/signalr-connection";
//Sound
import useSound from "use-sound";
import newSound from "/assets/sound/notification-sound.mp3";
//Components
import AlarmNotification from "../../components/AlarmNotification/AlarmNotification";

const NewAlarm = () => {
  const [show, setShow] = useState(false);
  const [alarm, setAlarm] = useState("");
  let [alarmCode, setAlarmCode] = useState("");
  const [notifications, setNotifications] = useState([]);

  const [play] = useSound(newSound, { volume: 2 });

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
          //play();
          let btn = document.getElementById("btn-sound");
          btn.click();

          const alarmData = async () => {
            try {
              const permission = await hasPermission(newAlarmCode);
              if (permission.data) {
                const data = await getAlarmData(newAlarmCode).then((res) => {
                  if (res.data.isSuccess) {
                    setAlarmCode(newAlarmCode);
                    setAlarm(res.data.result);
                    setShow(true);
                  }
                });
              }
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
      <button
        onClick={play}
        variant="transparency-second"
        id="btn-sound"
        style={{ display: "none" }}
      ></button>

      <AlarmNotification
        alarmData={`${alarmCode} - ${alarm.alarmDescription}`}
        hideToast={() => setShow(false)}
        toastShow={show}
      />
    </>
  );
};

export default NewAlarm;
