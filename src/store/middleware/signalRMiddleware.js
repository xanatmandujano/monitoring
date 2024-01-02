import { HubConnectionBuilder } from "@microsoft/signalr";
import url from "/config.json";
import { setNewAlarm } from "../slices/alarmsSlice";

const signalRMiddleware = (store) => (next) => (action) => {
  const hubUrl = url.server.apiUrl;
  const connection = new HubConnectionBuilder()
    .withUrl(`${hubUrl}/hubs/notifications`)
    .withAutomaticReconnect()
    .build();

  if (connection) {
    connection
      .start()
      .then(() => {
        connection.on("ReceiveMessage", (message) => {
          let newAlarm = JSON.parse(message.message);
          let newAlarmCode = newAlarm.Code;
          console.log(newAlarm);
        });
      })
      .catch((e) => console.log(`Connection failed: ${e}`));
  }

  next(action);
};

export default signalRMiddleware;
