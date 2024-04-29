import React, { useState, useEffect } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { alarmsHistory } from "../../store/actions/alarmsActions";
import { clearMessage } from "../../store/slices/messageSlice";
//React-router-dom
import { Outlet, useParams } from "react-router-dom";
//Components
import AlarmHistoryData from "../../components/AlarmDetails/AlarmHistoryData";
import Container from "react-bootstrap/Container";
import Loader from "../../components/Loader/Loader";
import SearchBar from "./SearchBar";
import Pagination from "react-bootstrap/Pagination";

const AlarmsHistory = () => {
  const [loader, setLoader] = useState(false);
  const [currPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState();

  const { allAlarms, alarmsPages } = useSelector((state) => state.alarms);
  const dispatch = useDispatch();
  const { idVideo } = useParams();

  useEffect(() => {
    setLoader(true);
    dispatch(clearMessage());
    dispatch(
      alarmsHistory({
        pageNumber: currPage,
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
  }, [dispatch, currPage]);

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

  const handleNextPage = () => {
    setCurrentPage(currPage + 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currPage - 1);
  };

  const handleLastPage = () => {
    setCurrentPage(alarmsPages);
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
        <>
          <AlarmHistoryData alarms={allAlarms} />
          <Pagination data-bs-theme="dark">
            <div className="arrow">
              <Pagination.First
                onClick={handleFirstPage}
                disabled={currPage === 1}
              />
              <Pagination.Prev
                onClick={handlePrevPage}
                disabled={currPage === 1}
              />
            </div>
            <p>{`${currPage}/${alarmsPages}`}</p>
            <div className="arrow">
              <Pagination.Next
                onClick={handleNextPage}
                disabled={currPage === alarmsPages}
              />
              <Pagination.Last
                onClick={handleLastPage}
                disabled={currPage === alarmsPages}
              />
            </div>
          </Pagination>
        </>
      ) : (
        <Outlet />
      )}
    </Container>
  );
};

export default AlarmsHistory;
