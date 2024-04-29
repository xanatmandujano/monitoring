import { createAsyncThunk } from "@reduxjs/toolkit";
//Slices
import { setMessage } from "../slices/messageSlice";
import {
  setNewNotification,
  setConnection,
  setAction,
} from "../slices/notificationsSlice";
//Services
import { getAlarmData } from "../../services/alarmsService";
//Hub
import { HubConnectionBuilder } from "@microsoft/signalr";

let connection = "";

export const alarmNotificationHub = createAsyncThunk(
  "alarm/alarmNotificationHub",
  async ({ url }, thunkAPI) => {
    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect()
        .build();

      connection = newConnection;
      //thunkAPI.dispatch(setConnection(newConnection));

      if (newConnection) {
        newConnection
          .start()
          .then(() => {
            //console.log("Connected with store!");
            newConnection.on("ReceiveMessage", (message) => {
              //console.log(message);
              let newNotification = JSON.parse(message.message);

              if (Object.hasOwn(newNotification, "Code")) {
                let newAlarm = JSON.parse(message.message);
                let newAlarmCode = newAlarm.Code;
                //console.log(newNotification);
                thunkAPI.dispatch(setNewNotification(newAlarmCode));
              }

              if (Object.hasOwn(newNotification, "action")) {
                let viewNotification = JSON.parse(message.message);
                let viewAction = viewNotification.action;
                let notificationAlarmId = viewNotification.alarmId;
                console.log(newNotification);
                thunkAPI.dispatch(
                  setAction({
                    viewAction: viewAction,
                    notificationId: notificationAlarmId,
                  })
                );
              }
            });
          })
          .catch((e) => console.log(`Connection failed: ${e}`));
      }
    } catch (error) {
      console.log(error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const sendMessage = createAsyncThunk(
  "alarm/sendNotification",
  async ({ send, message }, thunkAPI) => {
    try {
      if (connection) {
        await connection.send(send, message);
        return message;
      }
    } catch (error) {
      console.log(error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);
