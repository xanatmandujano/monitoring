//Axios
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API;

export const login = async (email, password) => {
  const response = await axios.post(`${baseURL}/user/login`, {
    email: email,
    password: password,
  });
  if (response.data.isSuccess) {
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("userToken", response.data.token.accessToken);
    sessionStorage.setItem("userLogged", response.data.isSuccess);
    sessionStorage.setItem("userName", response.data.fullName);
    return response;
  } else {
    return response;
  }
};

export const logout = () => {
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("userLogged");
};
