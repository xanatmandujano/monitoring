import React, { useState, useEffect, useRef } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  alarmNotificationHub,
  todayAlarms,
} from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
//Bootstrap
import Container from "react-bootstrap/Container";
//Components
import AlarmCard from "../../components/AlarmCard/AlarmCard";
import SearchField from "../../components/SearchField/SearchField";

const AlarmsSidebar = () => {
  const { alarmNotification, alarms, alarmsPages } = useSelector(
    (state) => state.alarms
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(todayAlarms({ pageNumber: alarmsPages, pageSize: 25 }))
      .unwrap()
      .then(() => {
        console.log("Today alarms succedded");
      });
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

  const alarmType = (alarmTypeId, alarmId) => {
    if (alarmTypeId === 1) {
      return `seproban/${alarmId}`;
    } else if (alarmTypeId === 2) {
      return alarmId;
    }
  };

  return (
    <>
      <div className="search-bar">
        <SearchField changeEvent={handleSearch} disabled={alarms > 0} />
      </div>
      <Container className="alarms-side-bar">
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
            />
          ))}
      </Container>
    </>
  );
};

export default AlarmsSidebar;
