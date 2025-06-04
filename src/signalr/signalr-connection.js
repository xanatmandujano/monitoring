import * as signalR from "@microsoft/signalr";
import url from "/config.json";

const hubUrl = url.server.apiUrl;

let connection = null;

export const getHubConnection = (url) => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${url}`, {
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect([0, 1000, 5000, 10000, 30000])
      .build();
  }

  return connection;
};
