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
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import ReportModal from "./ReportModal";
import Button from "react-bootstrap/Button";

const AlarmsHistory = () => {
  const [loader, setLoader] = useState(false);
  const [currPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [value, setValue] = useState({
    columnName: "creationDate",
    searchText: "",
    isEvent: null,
  });

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
        columnName: value.columnName,
        //sortDirection: "desc",
        searchText: value.searchText,
        isEvent: value.isEvent,
      })
    )
      .unwrap()
      .then(() => {
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setShow(true);
      });
  }, [dispatch, currPage]);

  const search = (values) => {
    setValue({
      columnName: values.filter,
      searchText: values.search,
      isEvent: values.isEvent,
    });
    setLoader(true);
    dispatch(
      alarmsHistory({
        pageNumber: 1,
        pageSize: 50,
        columnName: values.filter,
        //sortDirection: "desc",
        searchText: values.search,
        isEvent: values.isEvent,
      })
    )
      .unwrap()
      .then(() => {
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        setShow(true);
      });
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
      {!idVideo ? (
        <div className="history-options">
          <SearchBar
            //disabled={allAlarms && allAlarms.length === 0}
            submit={async (values) => {
              search(values);
              setCurrentPage(1);
            }}
          />
          <Button onClick={() => setModalShow(true)} variant="main">
            Reporte
          </Button>
        </div>
      ) : null}

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
            <p>{`${
              allAlarms && allAlarms.length === 0 ? 0 : currPage
            }/${alarmsPages}`}</p>
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

          <ErrorMessage
            headermessage="Ocurrió un error"
            message="El criterio de búsqueda no es válido"
            show={show}
            onHide={() => setShow(false)}
          />
        </>
      ) : (
        <Outlet />
      )}
      <ReportModal show={modalShow} onHide={() => setModalShow(false)} />
    </Container>
  );
};

export default AlarmsHistory;
