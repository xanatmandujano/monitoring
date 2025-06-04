import React, { useState, useEffect, useRef } from "react";
//Redux
import { useDispatch } from "react-redux";
import { clearMessage } from "../../store/slices/messageSlice";
import { hasPermission } from "../../services/authService";
import { useGetMessagesQuery } from "../../store/api/signalRApi";
//Hub
import { getAlarmData } from "../../services/alarmsService";
//Sound
import useSound from "use-sound";
import newSound from "/assets/sound/notification-sound.mp3";
//Components
import AlarmNotification from "../../components/AlarmNotification/AlarmNotification";

const NewAlarm = () => {
  const [show, setShow] = useState(false);
  const [alarm, setAlarm] = useState("");
  const { data } = useGetMessagesQuery();
  let [alarmCode, setAlarmCode] = useState("");

  const [play] = useSound(newSound, { volume: 2 });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());

    let alarmCode = null;

    if (data && data.length > 0) {
      if (Object.hasOwn(data && data[0], "Code")) {
        let btn = document.getElementById("btn-sound");
        btn.click();
        alarmCode = data[0].Code;
      } else {
        alarmCode = null;
      }
    }

    const alarmData = async () => {
      try {
        const permission = await hasPermission(alarmCode);
        if (permission.data) {
          await getAlarmData(alarmCode).then((res) => {
            if (res.data.isSuccess) {
              setAlarmCode(alarmCode);
              setAlarm(res.data.result);
              setShow(true);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (alarmCode) {
      alarmData();
    }
  }, [data]);

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
