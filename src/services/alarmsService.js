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
  }).then((res) => {
    if (res.data.isSuccess) {
      console.log(res.data.result);
      return res;
    } else console.log(res);
  });
};
