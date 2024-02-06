import React, { useState, useEffect, useRef } from "react";
import url from "/config.json";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { todayAlarms } from "../../store/actions/alarmsActions";
import { alarmNotificationHub } from "../../store/actions/notificationActions";
import { clearMessage } from "../../store/slices/messageSlice";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getAlarmData } from "../../services/alarmsService";
//Bootstrap
import Container from "react-bootstrap/Container";
//React-router-dom
import { useLocation, useParams } from "react-router-dom";
//Components
import AlarmCard from "../../components/AlarmCard/AlarmCard";
import SearchField from "../../components/SearchField/SearchField";
import NewAlarmCard from "./NewAlarmCard";
import Button from "react-bootstrap/Button";
import { BsXLg } from "react-icons/bs";

const AlarmsSidebar = (props) => {
  const { alarms } = useSelector((state) => state.alarms);
  //const { newAlarm, action } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const [show, setShow] = useState("none");
  const [notifications, setNotifications] = useState([]);
  const [connection, setConnection] = useState("");
  const [alarmCode, setAlarmCode] = useState();
  const [vAlarm, setVAlarm] = useState();
  const { idVideo } = useParams();
  const latestAlarm = useRef(null);
  latestAlarm.current = notifications;
  const hubUrl = url.server.apiUrl;

  useEffect(() => {
    dispatch(clearMessage());
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${hubUrl}/hubs/notifications`)
      .withAutomaticReconnect()
      .build();

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
              setVAlarm(notificationAlarmId);
            }
          });
        })
        .catch((e) => console.log(`Connection failed: ${e}`));
    }

    const alarmData = async () => {
      try {
        const data = await getAlarmData(alarmCode && alarmCode).then((res) => {
          if (res.data.isSuccess) {
            const updatedNotifications = [...latestAlarm.current];
            updatedNotifications.unshift(res.data.result);
            setNotifications(updatedNotifications);
            notifications.reverse();
            setShow(true);
          }
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    alarmData();
  }, [dispatch, alarmCode]);

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

  useEffect(() => {
    const styleChange = () => {
      if (vAlarm) {
        let element = document.getElementById(vAlarm);
        element.className = "alarm-disabled card";
      }
    };

    styleChange();
  }, [vAlarm]);

  //Send message
  const viewAlarm = async (alarmId) => {
    const chatMessage = {
      user: sessionStorage.getItem("userId"),
      message: JSON.stringify({
        action: "viewed",
        alarmId: alarmId,
      }),
    };

    try {
      if (connection) {
        await connection.send("SendToOthers", chatMessage).then(() => {
          console.log("Message sent");
        });
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
  const filteredAlarms =
    alarms &&
    alarms.filter((el) => {
      if (search === "") {
        return el;
      } else {
        return el.alarmCode.toLowerCase().includes(search);
      }
    });

  const alarmType = (alarmTypeId, alarmId) => {
    if (alarmTypeId === 1) {
      return `seproban/${alarmId}`;
    } else if (alarmTypeId === 2) {
      return `${alarmId}`;
    } else if (alarmTypeId === 3) {
      return `blackList/${alarmId}`;
    } else if (alarmTypeId === 4) {
      return `whiteList/${alarmId}`;
    }
  };

  return (
    <>
      <div className="search-bar">
        <SearchField changeEvent={handleSearch} disabled={!alarms} />
      </div>
      {/* <Button onClick={() => viewAlarm(27783)}>Send</Button> */}
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
              alarmParams={alarmType(item.alarmTypeId, item.alarmId)}
              display={{ display: show }}
              classN={
                item.alarmId == idVideo ? "newAlarm intermitent" : "newAlarm"
              }
              activeId={item.alarmId}
              onClick={() => viewAlarm(item.alarmId)}
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
              alarmParams={alarmType(item.alarmTypeId, item.alarmId)}
              classN={item.alarmId == idVideo ? "intermitent" : ""}
              activeId={item.alarmId}
              onClick={() => viewAlarm(item.alarmId)}
            />
          ))}
      </Container>
    </>
  );
};

export default AlarmsSidebar;
