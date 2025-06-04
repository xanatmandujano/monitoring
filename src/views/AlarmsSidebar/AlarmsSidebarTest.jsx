import React, { useState, useEffect, useRef } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  todayAlarms,
  releaseAlarm,
  alarmStatus,
} from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
import { getAlarmData } from "../../services/alarmsService";
import { hasPermission } from "../../services/authService";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../../store/api/signalRApi";
//Scripts
import { getPermissions } from "../../scripts/getPermissions";
//Bootstrap
import Container from "react-bootstrap/Container";
//React-router-dom
import { useParams, useNavigate } from "react-router-dom";
//Components
import AlarmCard from "../../components/AlarmCard/AlarmCard";
import SearchField from "../../components/SearchField/SearchField";
import alarmPng from "/assets/images/alarm.png";

const AlarmsSidebarTest = () => {
  const { alarms } = useSelector((state) => state.alarms);
  const { userId } = useSelector((state) => state.persist.authState.authInfo);
  const { data } = useGetMessagesQuery();
  const [sendMessage] = useSendMessageMutation();
  const dispatch = useDispatch();
  const { idVideo } = useParams();

  //Notifications
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState("none");
  const latestAlarm = useRef(null);
  latestAlarm.current = notifications;
  const navigate = useNavigate();
  let location = window.location.href;

  useEffect(() => {
    //Notification push
    function notifyMe(title, body, icon) {
      let notification = new Notification(title, { body: body, icon: icon });
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
      } else if (Notification.permission === "granted") {
        notification.onclick = (e) => {
          e.preventDefault();
          window.open(`${location}`, "_blank");
        };
      } else if (Notification.permission === "denied") {
        Notification.requestPermission().then((res) => {
          notification.onclick = (e) => {
            e.preventDefault();
            window.open(`${location}`, "_blank");
          };
        });
      }
    }

    let alarmCode = null;
    let alarmAction = null;
    let alarmActionId = null;

    if (data && data.length > 0) {
      if (Object.hasOwn(data && data[0], "Code")) {
        alarmCode = data[0].Code;
      } else if (data && Object.hasOwn(data && data[0], "action")) {
        alarmAction = data[0].action;
        alarmActionId = data[0].alarmId;
      }
    }

    const alarmData = async () => {
      try {
        const permission = await hasPermission(alarmCode);
        if (permission.data) {
          await getAlarmData(alarmCode).then((res) => {
            if (res.data.isSuccess) {
              const updatedNotifications = [...latestAlarm.current];
              updatedNotifications.unshift(res.data.result);
              setNotifications(updatedNotifications);

              notifications.reverse();
              setShow(true);

              notifyMe(
                res.data.result.alarmDescription,
                res.data.result.alarmCode,
                alarmPng,
                res.data.result.alarmId
              );
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

    //Card visibility style
    const styleActions = () => {
      if (alarmAction === "discarded" || alarmAction === "accepted") {
        let element = document.getElementById(alarmActionId);
        console.log(element);
        if (element) element.style.display = "none";
      } else if (alarmAction === "viewed") {
        let element = document.getElementById(alarmActionId);
        if (element) element.className = "alarm-disabled card";
      } else if (alarmAction === "release") {
        let element = document.getElementById(alarmActionId);
        if (element) element.className = "alarm-card card";
      } else if (alarmAction === "reactivated") {
        let element = document.getElementById(alarmActionId);
        if (element) element.style.display = "block";
        if (element) element.className = "alarm-card card";
      }
    };

    if (alarmAction) {
      styleActions();
    }
  }, [data]);

  useEffect(() => {
    //Show today alarms
    dispatch(clearMessage());
    dispatch(
      todayAlarms({
        pageNumber: 1,
        pageSize: 0,
        columnName: "creationDate",
        sortDirection: "desc",
      })
    );
  }, [dispatch]);

  //Click on alarm button
  const viewAlarm = async (alarmTypeId, alarmId) => {
    const viewAction = {
      user: userId,
      message: JSON.stringify({
        action: "viewed",
        alarmId: alarmId,
      }),
    };

    const releaseAction = {
      user: userId,
      message: JSON.stringify({
        action: "release",
        alarmId: idVideo,
      }),
    };

    //Alarm released from card
    if (idVideo) {
      await sendMessage(releaseAction);
      await sendMessage(viewAction);
      dispatch(releaseAlarm({ alarmId: idVideo }))
        .unwrap()
        .then(() => {
          let element = document.getElementById(idVideo);
          if (element) element.className = "alarm-card card";
          if (alarmTypeId === 1) {
            return navigate(`seproban/${alarmId}`);
          } else if (alarmTypeId === 2) {
            return navigate(`${alarmId}`);
          } else if (alarmTypeId === 3) {
            return navigate(`blackList/${alarmId}`);
          } else if (alarmTypeId === 4) {
            return navigate(`whiteList/${alarmId}`);
          }
        });
    } else {
      await sendMessage(viewAction).unwrap();
      if (alarmTypeId === 1) {
        return navigate(`seproban/${alarmId}`);
      } else if (alarmTypeId === 2) {
        return navigate(`${alarmId}`);
      } else if (alarmTypeId === 3) {
        return navigate(`blackList/${alarmId}`);
      } else if (alarmTypeId === 4) {
        return navigate(`whiteList/${alarmId}`);
      }
    }
  };

  //Search bar
  const [search, setSearch] = useState("");
  let handleSearch = (e) => {
    var toLowerCase = e.target.value.toLowerCase();
    setSearch(toLowerCase);
  };

  //Filter today alarms
  const permissions = getPermissions();

  const permissionAlarms =
    alarms && alarms.filter((el) => permissions.includes(el.permissionId));

  const filteredAlarms =
    permissionAlarms &&
    permissionAlarms.filter((el) => {
      if (search === "") {
        return el;
      } else {
        return el.alarmCode.toLowerCase().includes(search);
      }
    });

  return (
    <>
      <div className="search-bar">
        <SearchField changeEvent={handleSearch} disabled={alarms} />
      </div>
      <Container className="alarms-side-bar">
        {notifications &&
          notifications.map((item) => (
            <AlarmCard
              key={item.alarmId}
              alarmCode={item.alarmCode}
              alarmIcon={item.alarmTypeIcon}
              alarmDescription={item.alarmDescription}
              locationInfo={item.locationInfo}
              deviceCode={item.deviceCode}
              deviceIPAddress={item.deviceIPAddress}
              creationDate={item.creationDate}
              display={{ display: show }}
              classN={item.alarmId == idVideo ? "intermitent" : ""}
              activeId={item.alarmId}
              onClick={() => viewAlarm(item.alarmTypeId, item.alarmId)}
              disabled={item.alarmId == idVideo}
            />
          ))}

        {filteredAlarms &&
          filteredAlarms.map((item) => (
            <AlarmCard
              key={item.alarmId}
              alarmCode={item.alarmCode}
              alarmIcon={item.alarmTypeIcon}
              alarmDescription={item.alarmDescription}
              locationInfo={item.locationInfo}
              deviceCode={item.deviceCode}
              deviceIPAddress={item.deviceIPAddress}
              creationDate={item.creationDate}
              classN={
                item.alarmId == idVideo
                  ? "intermitent"
                  : "" || item.inUse === true
                  ? "alarm-disabled"
                  : ""
              }
              activeId={item.alarmId}
              onClick={() => viewAlarm(item.alarmTypeId, item.alarmId)}
              //disabled={item.inUse}
              disabled={item.alarmId == idVideo || item.inUse}
            />
          ))}
      </Container>
    </>
  );
};

export default AlarmsSidebarTest;
