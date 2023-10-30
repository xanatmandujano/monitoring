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
    return response.data;
  } else console.log(response);
};

export const getAlarmAttachments = async (alarmId) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${baseURL}/alarm/getalarmattachments`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        alarmId: alarmId,
      },
    });
    if (response.data.isSuccess) {
      //console.log(response.data.result);
      return response.data.result;
    } else return console.log(response);
  } catch (error) {
    console.log(error.message);
  }
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

export const validateAlarm = async (alarmId, userId, comments) => {
  const response = await axios({
    method: "POST",
    url: `${baseURL}/validatealarm`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      alarmId: alarmId,
      userId: userId,
      comments: comments,
    },
  });
  if (response.data.isSuccess) {
    return response;
  } else {
    return console.log(response);
  }
};
