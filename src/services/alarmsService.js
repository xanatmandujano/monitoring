import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API;
const token = sessionStorage.getItem("userToken");

export const getTodayAlarms = async (
  pageNumber,
  pageSize,
  columnName,
  sortDirection,
  searchText
) => {
  const response = await axios({
    method: "GET",
    url: `${baseURL}/alarm/gettodayalarms`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      columnName: columnName,
      sortDirection: sortDirection,
      searchText: searchText,
    },
  });
  if (response.data.isSuccess) {
    //console.log(response.data.result);
    return response.data.result;
  } else console.log(response);
};

export const getAlarmAttachments = async (alarmId) => {
  const response = await axios({
    method: "GET",
    url: `${baseURL}/alarm/getalarmattachments`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: alarmId,
  });
  if (response.data.isSuccess) {
    //console.log(res.data.result);
    return response;
  } else console.log(response);
};

export const getAlarmData = async (code) => {
  const response = await axios({
    method: "GET",
    url: `${baseURL}/alarm/getalarmdata`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      code: code,
    },
  });
  if (response.data.isSuccess) {
    //console.log(response);
    return response;
  } else {
    return console.log(response);
  }
};
