import axios from "axios";
import url from "/config.json";

const baseURL = url.server.apiUrl;
const localInfo = localStorage.getItem("persist:root");
const parse = JSON.parse(localInfo);
const authState = JSON.parse(parse && parse.authState);
const token = authState && authState.authInfo.userToken;
const userId = authState && authState.authInfo.userId;

export const getUseCases = async (
  pageNumber,
  pageSize,
  columnName,
  sortDirection,
  searchText
) => {
  const response = await axios({
    method: `${baseURL}/useCase/getUseCases`,
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
    return response.data;
  } else console.log(response);
};

export const addPlateToUseCase = async (plateText, useCaseCode) => {
  const response = await axios({
    method: "POST",
    url: `${baseURL}/useCase/AddPlateToUseCase`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": `${baseURL}`,
    },
    data: {
      plateText: plateText,
      useCaseCode: useCaseCode,
    },
  });
  if (response.data.isSuccess) {
    return response;
  } else {
    return console.log(response);
  }
};
