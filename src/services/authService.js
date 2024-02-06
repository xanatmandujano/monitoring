//Axios
import axios from "axios";
import url from "/config.json";

const baseURL = url.server.apiUrl;
const token = sessionStorage.getItem("userToken");
const refresh = sessionStorage.getItem("refresh");

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
    },
  });
  if (response.data.isSuccess) {
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("userToken", response.data.token.accessToken);
    sessionStorage.setItem("refresh", response.data.token.refreshToken);
    sessionStorage.setItem("userLogged", response.data.isSuccess);
    sessionStorage.setItem("userName", response.data.fullName);
    sessionStorage.setItem("userId", response.data.userId);
    sessionStorage.setItem("expiration", response.data.token.expiration);
    return response;
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
    },
  });
  if (response.data.isSuccess) {
    sessionStorage.setItem("userToken", response.data.result.accessToken);
    sessionStorage.setItem("refresh", response.data.result.refreshToken);
    sessionStorage.setItem("expiration", response.data.result.expiration);
  } else {
    console.log(response);
    return response;
  }
};

export const logout = () => {
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("expiration");
  sessionStorage.removeItem("refresh");
  sessionStorage.removeItem("userLogged");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userId");
};
