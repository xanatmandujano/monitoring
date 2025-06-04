import React, { useState, useEffect, useRef } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { todayAlarms, releaseAlarm } from "../../store/actions/alarmsActions";
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
  const [lastAction, setLastAction] = useState();
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

    const alarmData = async () => {
      try {
        const permission = await hasPermission(
          data && data.alarms[0] && data.alarms[0].Code
        );
        if (permission.data) {
          await getAlarmData(
            data && data.alarms[0] && data.alarms[0].Code
          ).then((res) => {
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

    let alarmCode =
      data && data.alarms && data.alarms[0] && data.alarms[0].Code;

    if (alarmCode) {
      alarmData();
    }

    let alarmAction =
      data && data.actions && data.actions[0] && data.actions[0].action;
    let alarmActionId =
      data && data.actions && data.actions[0] && data.actions[0].alarmId;

    //Card visibility style
    const styleActions = () => {
      if (alarmAction === "viewed") {
        let element = document.getElementById(alarmActionId);
        element.className = "alarm-disabled card";
      }
    };

    if (data && data.actions && data.actions[0]) {
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
              classN={item.alarmId === idVideo ? "newAlarm intermitent" : ""}
              activeId={item.alarmId}
              onClick={() => viewAlarm(item.alarmTypeId, item.alarmId)}
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
              disabled={item.alarmId == idVideo}
            />
          ))}
      </Container>
    </>
  );
};

export default AlarmsSidebarTest;
