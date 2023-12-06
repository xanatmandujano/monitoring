import React, { useState, useEffect } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { alarmsHistory } from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
//React-router-dom
import { Outlet, useParams, Link } from "react-router-dom";
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
        sortDirection: "desc",
        searchText: "",
      })
    )
      .unwrap()
      .then(() => {
        setLoader(false);
      });
  }, [dispatch]);

  const search = (values) => {
    dispatch(
      alarmsHistory({
        pageNumber: 1,
        pageSize: 50,
        columnName: values.filter,
        sortDirection: "asc",
        searchText: values.search,
      })
    ).unwrap();
  };

  return (
    <Container className="alarms-history">
      <SearchBar
        submit={async (values) => {
          search(values);
        }}
      />

      {loader ? (
        <Loader />
      ) : !idVideo ? (
        <AlarmHistoryData alarms={allAlarms} />
      ) : (
        <Outlet />
      )}
    </Container>
  );
};

export default AlarmsHistory;
