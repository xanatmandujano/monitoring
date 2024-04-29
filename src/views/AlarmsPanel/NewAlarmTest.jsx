import React, { useState, useEffect, useRef } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../store/slices/messageSlice";
import { alarmData } from "../../store/actions/alarmsActions";
import { alarmNotificationHub } from "../../store/actions/notificationActions";
//Hub
import { getAlarmData } from "../../services/alarmsService";
import url from "/config.json";
import { Connector } from "../../signalr/signalr-connection";
//Components
import AlarmNotification from "../../components/AlarmNotification/AlarmNotification";

const NewAlarm = () => {
  const [show, setShow] = useState(false);
  const [alarm, setAlarm] = useState("");
  const dispatch = useDispatch();
  const hubUrl = url.server.apiUrl;
  const { newNotification } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(alarmNotificationHub({ url: `${hubUrl}/hubs/notifications` }))
      .unwrap()
      .then(() => {
        if (newNotification) {
          const alarmData = async () => {
            try {
              const data = await getAlarmData(newNotification).then((res) => {
                if (res.data.isSuccess) {
                  //setAlarmCode(newNotification);
                  setAlarm(res.data.result.alarmDescription);
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
  }, [newNotification]);

  return (
    <>
      <AlarmNotification
        alarmData={`${newNotification} - ${alarm}`}
        hideToast={() => setShow(false)}
        toastShow={show}
      />
    </>
  );
};

export default NewAlarm;
