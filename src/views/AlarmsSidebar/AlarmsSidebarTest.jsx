import React, { useState, useEffect, useRef } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { todayAlarms, releaseAlarm } from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
import { getAlarmData } from "../../services/alarmsService";
import { Connector } from "../../signalr/signalr-connection";
import url from "/config.json";
//Bootstrap
import Container from "react-bootstrap/Container";
//React-router-dom
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
//Components
import AlarmCard from "../../components/AlarmCard/AlarmCard";
import SearchField from "../../components/SearchField/SearchField";
import { alarmNotificationHub } from "../../store/actions/notificationActions";

const AlarmsSidebar = () => {
  const { alarms } = useSelector((state) => state.alarms);
  const { userId } = useSelector((state) => state.persist.authState.authInfo);
  const { newAction, newNotification } = useSelector(
    (state) => state.notifications
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState("none");
  const [allNotifications, setAllNotifications] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [connection, setConnection] = useState("");
  const [alarmCode, setAlarmCode] = useState();
  const { idVideo } = useParams();
  const location = useLocation();
  const latestAlarm = useRef(null);
  latestAlarm.current = notifications;
  const hubUrl = url.server.apiUrl;

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(alarmNotificationHub({ url: `${hubUrl}/hubs/notifications` }))
      .unwrap()
      .then(() => {
        if (
          newAction.action === "discarded" ||
          newAction.action === "accepted"
        ) {
          let element = document.getElementById(newAction.notificationId);
          element.style.display = "none";
        } else if (newAction.action === "viewed") {
          let element = document.getElementById(newAction.notificationId);
          let cardBtn = element.lastChild.lastChild.lastChild;
          element.className = "alarm-disabled card";
          cardBtn.setAttribute("disabled", "");
        } else if (newAction.action === "release") {
          let element = document.getElementById(newAction.notificationId);
          let cardBtn = element.lastChild.lastChild.lastChild;
          element.className = "alarm-card card";
          cardBtn.removeAttribute("disabled");
        }

        if (newNotification) {
          //setAllNotifications(newNotification);
          const alarmData = async () => {
            try {
              const data = await getAlarmData(newNotification).then((res) => {
                if (res.data.isSuccess) {
                  const updatedNotifications = [...latestAlarm.current];
                  updatedNotifications.unshift(res.data.result);
                  setNotifications(updatedNotifications);
                  notifications.reverse();
                  setShow(true);
                }
              });
            } catch (error) {
              console.log(error);
            }
          };
          alarmData();
        }
        console.log("Message recieved on sidebar");
      });
  }, [dispatch, newNotification]);

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

  return (
    <>
      <div className="search-bar">
        <SearchField changeEvent={handleSearch} disabled={!alarms} />
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
              //alarmParams={alarmType(item.alarmTypeId, item.alarmId)}
              display={{ display: show }}
              classN={
                item.alarmId == idVideo
                  ? "newAlarm intermitent"
                  : "" || item.inUse === true
                  ? "alarm-disabled"
                  : ""
              }
              activeId={item.alarmId}
              //onClick={() => closeAlarm(item.alarmId)}
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
              //alarmParams={alarmType(item.alarmTypeId, item.alarmId)}
              classN={
                item.alarmId == idVideo
                  ? "intermitent"
                  : "" || item.inUse === true
                  ? "alarm-disabled"
                  : ""
              }
              activeId={item.alarmId}
              onClick={() => closeAlarm(item.alarmId)}
              disabled={item.inUse}
            />
          ))}
      </Container>
    </>
  );
};

export default AlarmsSidebar;
