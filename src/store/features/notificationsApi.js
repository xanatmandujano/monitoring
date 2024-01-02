import { HubConnectionBuilder } from "@microsoft/signalr";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "/config.json";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${url.server.apiUrl}` }),
  endpoints: (build) => ({
    getNotifications: build.query({
      query: () => `/alarm/gettodayalarms`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const ws = new HubConnectionBuilder()
          .withUrl(`${url.server.apiUrl}/hubs/notifications`)
          .withAutomaticReconnect()
          .build();
        try {
          await cacheDataLoaded;
          if (ws) {
            ws.start().then(() => {
              ws.on("RecieveMessage", (message) => {
                let newNotification = JSON.parse(message.message);
                let newAlarmNotification = newNotification.Code;
                console.log(newAlarmNotification);

                updateCachedData((draft) => {
                  draft.push(newAlarmNotification);
                });
              });
            });
          }
        } catch (error) {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        await cacheEntryRemoved;
      },
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApi;
