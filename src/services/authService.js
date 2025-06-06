//Axios
import axios from "axios";
import url from "/config.json";

const baseURL = url.server.apiUrl;
//const token = sessionStorage.getItem("userToken");
//const refresh = sessionStorage.getItem("refresh");
const localInfo = localStorage.getItem("persist:root");
const parse = JSON.parse(localInfo);
const authState = JSON.parse(parse && parse.authState);
const userId = authState && authState.authInfo.userId;
const token = authState && authState.authInfo.userToken;
const refresh = authState && authState.authInfo.refresh;

export const login = async (email, password) => {
  const response = await axios({
    method: "POST",
    url: `${baseURL}/user/login`,
    data: {
      email: email,
      password: password,
    },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": `${baseURL}`,
    },
  });
  if (response.data.isSuccess) {
    return response.data;
  } else {
    console.log(response);
    return response;
  }
};

export const refreshToken = async () => {
  const response = await axios({
    method: "POST",
    url: `${baseURL}/token/refresh`,
    data: {
      accessToken: token,
      refreshToken: refresh,
    },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": `${baseURL}`,
    },
  });
  if (response.data.isSuccess) {
    //sessionStorage.setItem("userToken", response.data.result.accessToken);
    //sessionStorage.setItem("refresh", response.data.result.refreshToken);
    //sessionStorage.setItem("expiration", response.data.result.expiration);
    return response.data.result;
  } else {
    console.log(response);
    return response;
  }
};

export const hasPermission = async (alarmCode) => {
  const response = await axios({
    method: "GET",
    url: `${baseURL}/user/hasPermission`,
    headers: {
      //"Content-Type": "application/json",
      "Access-Control-Allow-Origin": `${baseURL}`,
      //Authorization: `Bearer ${token}`,
    },
    params: {
      userId: userId,
      alarmCode: alarmCode,
    },
  });
  if (response) {
    console.log(response);
    return response;
  } else {
    console.log(response);
    return response;
  }
};
