import React, { useState, useEffect, useRef } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { todayAlarms, releaseAlarm } from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
import { getAlarmData } from "../../services/alarmsService";
import { hasPermission } from "../../services/authService";
import { Connector } from "../../signalr/signalr-connection";
//Scripts
import { getPermissions } from "../../scripts/getPermissions";
//Bootstrap
import Container from "react-bootstrap/Container";
//React-router-dom
import { useParams, useLocation, useNavigate } from "react-router-dom";
//Components
import AlarmCard from "../../components/AlarmCard/AlarmCard";
import SearchField from "../../components/SearchField/SearchField";
import alarmPng from "/assets/images/alarm.png";
import FullLoader from "../../components/Loader/FullLoader";
import PlaceholderCard from "./PlaceholderCard";
import Loader from "../../components/Loader/Loader";
//import { alarmNotificationHub } from "../../store/actions/notificationActions";

const AlarmsSidebar = () => {
  const { alarms, alarmsCount, loading } = useSelector((state) => state.alarms);
  const { userId } = useSelector((state) => state.persist.authState.authInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState("none");
  const [notifications, setNotifications] = useState([]);
  const [connection, setConnection] = useState("");
  const [alarmCode, setAlarmCode] = useState();
  const [disabled, setDisabled] = useState(false);
  let [counter, setCounter] = useState(null);
  const { idVideo } = useParams();
  const latestAlarm = useRef(null);
  latestAlarm.current = notifications;
  let location = window.location.href;

  useEffect(() => {
    //Notification push
    Notification.requestPermission().then((res) => {
      //console.log(res);
    });

    function notifiyMe(title, body, icon) {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
      } else if (Notification.permission === "granted") {
        let notification = new Notification(title, {
          body: body,
          icon: icon,
        });
        notification.onclick = (e) => {
          e.preventDefault();
          window.open(`${location}`, "_blank");
        };
      } else if (Notification.permission === "denied") {
        Notification.requestPermission().then(
          (res) =>
            function (permission) {
              //console.log(res);
              if (permission === "granted") {
                let notification = new Notification(title, {
                  body: body,
                  icon: icon,
                });
                notification.onclick = (e) => {
                  e.preventDefault();
                  window.open(`${location}`, "_blank");
                };
              }
            }
        );
      }
    }

    dispatch(clearMessage());
    const newConnection = Connector();
    setConnection(newConnection);
    if (newConnection) {
      newConnection
        .start()
        .then(() => {
          newConnection.on("ReceiveMessage", (message) => {
            //console.log(message);
            let newNotification = JSON.parse(message.message);
            if (Object.hasOwn(newNotification, "Code")) {
              let newAlarm = JSON.parse(message.message);
              let newAlarmCode = newAlarm.Code;
              setAlarmCode(newAlarmCode);
            }
            if (Object.hasOwn(newNotification, "action")) {
              let viewNotification = JSON.parse(message.message);
              let viewAction = viewNotification.action;

              let notificationAlarmId = viewNotification.alarmId;

              if (viewAction === "discarded" || viewAction === "accepted") {
                let element = document.getElementById(notificationAlarmId);
                element.style.display = "none";
              } else if (viewAction === "viewed") {
                //console.log(message);
                let element = document.getElementById(notificationAlarmId);
                let cardBtn = element.lastChild.lastChild.lastChild;
                element.className = "alarm-disabled card";
                cardBtn.setAttribute("disabled", "");
                //setDisabled(true);
              } else if (viewAction === "release") {
                //console.log(message);
                let element = document.getElementById(notificationAlarmId);
                let cardBtn = element.lastChild.lastChild.lastChild;
                element.className = "alarm-card card";
                cardBtn.removeAttribute("disabled");
              } else if (viewAction === "reactivated") {
                let element = document.getElementById(notificationAlarmId);
                let cardBtn = element.lastChild.lastChild.lastChild;
                element.style.display = "block";
                element.className = "alarm-card card";
                cardBtn.removeAttribute("disabled");
              }
            }
          });
        })
        .catch((e) => console.log(`Connection failed: ${e}`));
    }

    const alarmData = async () => {
      try {
        const permission = await hasPermission(alarmCode && alarmCode);
        if (permission.data) {
          const data = await getAlarmData(alarmCode && alarmCode).then(
            (res) => {
              if (res.data.isSuccess) {
                const updatedNotifications = [...latestAlarm.current];
                updatedNotifications.unshift(res.data.result);
                setNotifications(updatedNotifications);

                notifications.reverse();

                setShow(true);
                notifiyMe(
                  res.data.result.alarmDescription,
                  alarmCode,
                  alarmPng,
                  res.data.result.alarmId
                );
              }
            }
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    setCounter(notifications.length + 1);

    if (alarmCode) {
      alarmData();
    }
  }, [dispatch, alarmCode]);

  const handleCount = () => {
    if (counter === 1 && alarmsCount >= 1) {
      let count = counter + alarmsCount - 1;
      return count;
    } else if (counter === 1 && alarmsCount === 0) {
      let count = counter - 1;
      return count + alarmsCount;
    } else if (counter > 1) {
      let count = counter + alarmsCount;
      return count;
    } else {
      return 0;
    }
  };

  useEffect(() => {
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

  //Send message
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
    try {
      if (connection) {
        await connection.send("SendToOthers", viewAction).then(() => {
          let element = document.getElementById(alarmId);
          let cardBtn = element.lastChild.lastChild.lastChild;
          cardBtn.setAttribute("disabled", "");
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
        if (idVideo) {
          dispatch(releaseAlarm({ alarmId: idVideo }));
          await connection.send("SendToAll", releaseAction).then(() => {
            //console.log("Alarm release from card");
            let element = document.getElementById(alarmId);
            let cardBtn = element.lastChild.lastChild.lastChild;
            cardBtn.setAttribute("disabled", "");
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
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Search bar
  const [search, setSearch] = useState("");
  let handleSearch = (e) => {
    var toLowerCase = e.target.value.toLowerCase();
    setSearch(toLowerCase);
  };

  //Filter alarms
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
        {/* <p>{`Total de alarmas: ${handleCount()}`}</p> */}
        <SearchField changeEvent={handleSearch} />
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
              classN={
                item.alarmId === idVideo
                  ? "newAlarm intermitent"
                  : "intermitent"
              }
              activeId={item.alarmId}
              onClick={() => viewAlarm(item.alarmTypeId, item.alarmId)}
              //disabled={item.inUse}
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
                item.alarmId === idVideo
                  ? "intermitent"
                  : "" || item.inUse === true
                  ? "alarm-disabled"
                  : ""
              }
              activeId={item.alarmId}
              onClick={() => viewAlarm(item.alarmTypeId, item.alarmId)}
              //disabled={item.inUse}
            />
          ))}
      </Container>
    </>
  );
};

export default AlarmsSidebar;
