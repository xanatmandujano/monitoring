import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "/config.json";
import * as signalR from "@microsoft/signalr";
import { getHubConnection } from "../../signalr/signalr-connection";
import { hasPermission } from "../../services/authService";
import { getAlarmData } from "../../services/alarmsService";
import { sendMessage } from "@microsoft/signalr/dist/esm/Utils";

const baseUrl = url.server.apiUrl;

export const signalRApi = createApi({
  reducerPath: "signalRApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      queryFn: () => ({
        data: [],
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const hubConnection = getHubConnection(`${baseUrl}/hubs/notifications`);
        try {
          await cacheDataLoaded;

          if (hubConnection.state === signalR.HubConnectionState.Disconnected) {
            await hubConnection.start();
          }

          hubConnection.on("ReceiveMessage", (event) => {
            let newNotification = JSON.parse(event.message);
            updateCachedData((draft) => {
              //Either the notification has a code or has an action
              draft.unshift(newNotification);
            });
          });

          await cacheEntryRemoved;
          hubConnection.off("ReceiveMessage");
          hubConnection.off("SendToOthers");
          hubConnection.off("SendToAll");
          await hubConnection.stop();
        } catch (error) {
          console.log("SignalR error message:", error);
        }
      },
    }),
    sendMessage: builder.mutation({
      queryFn: async (action) => {
        const hubConnection = getHubConnection(`${baseUrl}/hubs/notifications`);

        try {
          if (hubConnection.state === signalR.HubConnectionState.Disconnected) {
            await hubConnection.start();
            console.log(hubConnection.connectionId);
          }

          await hubConnection.invoke("SendToOthers", action);

          return { data: { success: true } };
        } catch (error) {
          return {
            error: { message: error.message || "Error al enviar el mensaje" },
          };
        }
      },
    }),
    sendMessageToAll: builder.mutation({
      queryFn: async (action) => {
        const hubConnection = getHubConnection(`${baseUrl}/hubs/notifications`);

        try {
          if (hubConnection.state === signalR.HubConnectionState.Disconnected) {
            await hubConnection.start();
          }
          await hubConnection.invoke("SendToAll", action);

          return { data: { success: true } };
        } catch (error) {
          return {
            error: { message: error.message || "Error al enviar el mensaje" },
          };
        }
      },
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useSendMessageToAllMutation,
} = signalRApi;
