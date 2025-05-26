import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "/config.json";
import { setMessage } from "../slices/messageSlice";

const baseUrl = url.server.apiUrl;

export const branchesStatusApi = createApi({
  reducerPath: "branchesStatusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  endpoints: (builder) => ({
    getBranchesStatus: builder.query({
      query: (params) => ({
        url: "alarmDevice/getBranchesStatuses",
        method: "GET",
        params: params,
      }),
      transformResponse: (res, meta, arg) => {
        //console.log(arg);
        return res;
      },
      transformErrorResponse: (res, meta, arg) => {
        console.log(res);
        return res;
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled.then((res) => {
            //console.log(res);
            return res;
          });
        } catch (error) {
          console.log(error);
          const message =
            error.error && error.error.data && error.error.data.message;
          dispatch(setMessage(message));
        }
      },
    }),
  }),
});

export const { useGetBranchesStatusQuery } = branchesStatusApi;
