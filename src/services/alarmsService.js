import axios from "axios";
import url from "/config.json";

const baseURL = url.server.apiUrl;
const token = sessionStorage.getItem("userToken");
const userId = sessionStorage.getItem("userId");

export const getAlarmsHistory = async (
  pageNumber,
  pageSize,
  columnName,
  sortDirection,
  searchText
) => {
  const response = await axios({
    method: "GET",
    url: `${baseURL}/alarm/getalarms`,
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
    return response.data;
  } else console.log(response);
};

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

export const validateAlarm = async (
  alarmId,
  comments,
  alarmUser,
  alarmTime,
  devices
) => {
  const response = await axios({
    method: "POST",
    url: `${baseURL}/seproban/sendtoseproban`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      alarmId: alarmId,
      userId: userId,
      comments: comments,
      alarmUser: alarmUser,
      alarmTime: alarmTime,
      devices: devices,
    },
  });
  if (response.data.isSuccess) {
    return response;
  } else {
    return console.log(response);
  }
};

export const validateImageAlarm = async (alarmId, comments) => {
  const response = await axios({
    method: "POST",
    url: `${baseURL}/alarm/validatealarm`,
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

export const setAlarmStatus = async (alarmId, statusId, comments) => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${baseURL}/alarm/setalarmstatus`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        alarmId: alarmId,
        statusId: statusId,
        userId: userId,
        comments: comments,
      },
    });
    if (response.data.isSuccess) {
      return response;
    } else {
      return console.log(response);
    }
  } catch (error) {
    console.log(error.message);
  }
};
