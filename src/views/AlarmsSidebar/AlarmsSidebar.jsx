import React, { useState, useEffect, useRef } from "react";
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

const AlarmsSidebar = () => {
  const { alarms, alarmsCount } = useSelector((state) => state.alarms);
  const { newAlarm } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const [show, setShow] = useState("none");
  const [prevAlarm, setPrevAlarm] = useState("");
  const { idVideo } = useParams();
  const latestAlarm = useRef();
  latestAlarm.current = prevAlarm;

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(
      alarmNotificationHub({
        url: "https://192.168.1.120:8091/hubs/notifications",
      })
    )
      .unwrap()
      .then(() => {
        //setShow("block");
        setPrevAlarm(newAlarm);
        dispatch(
          todayAlarms({
            pageNumber: 1,
            pageSize: 0,
            columnName: "creationDate",
            sortDirection: "desc",
          })
        ).unwrap();
      });
  }, [dispatch, newAlarm]);

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
      return alarmId;
    } else if (alarmTypeId === 3) {
      return `blackList/${alarmId}`;
    } else if (alarmTypeId === 4) {
      return `whiteList/${alarmId}`;
    }
  };

  return (
    <>
      <div className="search-bar">
        <SearchField changeEvent={handleSearch} disabled={alarms > 0} />
      </div>
      <Container className="alarms-side-bar">
        {/* {newAlarm && (
          <AlarmCard
            key={newAlarm.alarmId}
            alarmCode={newAlarm.alarmCode}
            alarmIcon={newAlarm.alarmTypeIcon}
            alarmDescription={newAlarm.alarmDescription}
            locationInfo={newAlarm.locationInfo}
            deviceCode={newAlarm.deviceCode}
            deviceIPAddress={newAlarm.deviceIPAddress}
            creationDate={newAlarm.creationDate}
            alarmParams={alarmType(newAlarm.alarmTypeId, newAlarm.alarmId)}
            display={{ display: show }}
            classN="newAlarm"
          />
        )} */}

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
            />
          ))}
      </Container>
    </>
  );
};

export default AlarmsSidebar;
