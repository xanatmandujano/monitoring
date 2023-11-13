//Axios
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API;

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
    sessionStorage.setItem("userLogged", response.data.isSuccess);
    sessionStorage.setItem("userName", response.data.fullName);
    sessionStorage.setItem("userId", response.data.userId);
    console.log(response);
    return response;
  } else {
    console.log(response);
    return response;
  }
};

export const logout = () => {
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("userLogged");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userId");
};
