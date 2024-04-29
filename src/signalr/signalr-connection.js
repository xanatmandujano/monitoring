import * as signalR from "@microsoft/signalr";
import url from "/config.json";

const hubUrl = url.server.apiUrl;

export function Connector() {
  const newConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${hubUrl}/hubs/notifications`)
    .withAutomaticReconnect()
    .build();

  //newConnection.start();
  return newConnection;
}
