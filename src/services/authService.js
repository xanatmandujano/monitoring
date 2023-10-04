//Axios
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API;

export const login = async (user, password) => {
  const response = await axios
    .post(`${baseURL}/user/login`, {
      email: user,
      password: password,
    })
    .then((res) => {
      if (res.data.isSuccess) {
        sessionStorage.setItem("user", user);
        sessionStorage.setItem("userToken", res.data.token.accessToken);
        sessionStorage.setItem("userLogged", res.data.isSuccess);
        console.log(res.data.message);
        return res;
      } else console.log(res);
    });
};

export const logout = () => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("userLogged");
};
