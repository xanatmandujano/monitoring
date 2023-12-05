import React, { useState, useEffect } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { alarmsHistory } from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
//Formik
import { Form, Formik } from "formik";
//React-router-dom
import { Outlet, useParams } from "react-router-dom";
//Components
import AlarmHistoryData from "../../components/AlarmDetails/AlarmHistoryData";
import Container from "react-bootstrap/Container";
import Loader from "../../components/Loader/Loader";
import SearchBar from "./SearchBar";

const AlarmsHistory = () => {
  const [loader, setLoader] = useState(false);

  const { allAlarms } = useSelector((state) => state.alarms);
  const dispatch = useDispatch();
  const { idVideo } = useParams();

  useEffect(() => {
    setLoader(true);
    dispatch(clearMessage());
    dispatch(
      alarmsHistory({
        pageNumber: 1,
        pageSize: 50,
        columnName: "creationDate",
        sortDirection: "asc",
        searchText: "",
      })
    )
      .unwrap()
      .then(() => {
        setLoader(false);
      });
  }, [dispatch]);

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
    <Container className="alarms-history">
      <SearchBar />
      {loader ? (
        <Loader size="lg" />
      ) : !idVideo ? (
        allAlarms &&
        allAlarms.map((item) => (
          <AlarmHistoryData
            key={item.alarmId}
            alarmDescription={item.alarmDescription}
            branchCode={item.branchCode}
            creationDate={item.creationDate}
            alarmStatus={item.status}
            alarmParams={alarmType(item.alarmTypeId, item.alarmId)}
            btnText="Ver alarma"
          />
        ))
      ) : (
        <Outlet />
      )}
    </Container>
  );
};

export default AlarmsHistory;
