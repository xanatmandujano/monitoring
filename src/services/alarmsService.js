import axios from "axios";
import url from "/config.json";
import QueryString from "qs";

const baseURL = url.server.apiUrl;
const localInfo = localStorage.getItem("persist:root");
const parse = JSON.parse(localInfo);
const authState = JSON.parse(parse && parse.authState);
const token = authState && authState.authInfo.userToken;
const userId = authState && authState.authInfo.userId;

export const getAlarmsHistory = async (
  pageNumber,
  pageSize,
  columnName,
  sortDirection,
  searchText,
  permissions
) => {
  const perm = permissions;
  const response = await axios({
    method: "GET",
    url: `${baseURL}/alarm/getEventsAndAlarms`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": `${baseURL}`,
    },
    params: {
      isEvent: false,
      pageNumber: pageNumber,
      pageSize: pageSize,
      columnName: columnName,
      sortDirection: sortDirection,
      searchText: searchText,
      permissions: perm,
    },
    paramsSerializer: (params) =>
      QueryString.stringify(params, { arrayFormat: "repeat" }),
  });
  if (response.data.isSuccess) {
    //console.log(response);
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
      "Access-Control-Allow-Origin": `${baseURL}`,
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
        "Access-Control-Allow-Origin": `${baseURL}`,
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

export const getAttachment = async (attachmentId) => {
  const response = await axios({
    method: "GET",
    url: `${baseURL}/alarm/getAttachment`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": `${baseURL}`,
    },
    params: {
      alarmAttachmentId: attachmentId,
    },
  });
  if (response.data.isSuccess) {
    //console.log(response);
    return response;
  } else {
    return console.log(response);
  }
};

export const getAlarmData = async (code) => {
  const response = await axios({
    method: "GET",
    url: `${baseURL}/alarm/getalarmdata`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": `${baseURL}`,
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

export const getAlarmsReport = async (
  startTime,
  endTime,
  pageNumber,
  pageSize,
  columnName,
  sortDirection,
  searchText,
  permissions
) => {
  const perm = permissions;
  const response = await axios({
    method: "GET",
    url: `${baseURL}/alarm/getAlarmsReport`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      startTime: startTime,
      endTime: endTime,
      pageNumber: pageNumber,
      pageSize: pageSize,
      columnName: columnName,
      sortDirection: sortDirection,
      searchText: searchText,
      permissions: perm,
    },
    paramsSerializer: (params) =>
      QueryString.stringify(params, { arrayFormat: "repeat" }),
  });
  if (response.data.isSuccess) {
    return response.data;
  } else {
    return console.log(response);
  }
};

export const validateAlarm = async (
  alarmId,
  comments,
  alarmUser,
  alarmTime,
  devices,
  allDevices,
  signal
) => {
  const response = await axios({
    method: "POST",
    url: `${baseURL}/seproban/sendtoseproban`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": `${baseURL}`,
    },
    data: {
      alarmId: alarmId,
      userId: userId,
      comments: comments,
      alarmUser: alarmUser,
      alarmTime: alarmTime,
      devices: devices,
      allDevices: allDevices,
    },
    signal: signal,
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
      "Access-Control-Allow-Origin": `${baseURL}`,
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
        "Access-Control-Allow-Origin": `${baseURL}`,
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

export const releaseViewedAlarm = async (alarmId) => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${baseURL}/alarm/releaseviewedalarm`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": `${baseURL}`,
      },
      params: {
        alarmId: alarmId,
      },
    });
    if (response.data.isSuccess) {
      //console.log(response);
      return response;
    } else {
      return console.log(response);
    }
  } catch (error) {
    console.log(error.message);
  }
};
