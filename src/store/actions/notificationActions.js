import { createAsyncThunk } from "@reduxjs/toolkit";
//Slices
import { setMessage } from "../slices/messageSlice";
import {
  setNewAlarm,
  setConnection,
  setAction,
} from "../slices/notificationsSlice";
//Services
import { getAlarmData } from "../../services/alarmsService";
//Hub
import { HubConnectionBuilder } from "@microsoft/signalr";

export const alarmNotificationHub = createAsyncThunk(
  "alarm/alarmNotificationHub",
  async ({ url }, thunkAPI) => {
    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect()
        .build();

      if (newConnection) {
        newConnection
          .start()
          .then(() => {
            console.log("Connected with store!");
            newConnection.on("ReceiveMessage", (message) => {
              //console.log(message);
              let newNotification = JSON.parse(message.message);
              //New alarm notification
              if (Object.hasOwn(newNotification, "Code")) {
                let newAlarm = JSON.parse(message.message);
                let newAlarmCode = newAlarm.Code;
                thunkAPI.dispatch(setNewAlarm(newAlarmCode));
              }

              if (Object.hasOwn(newNotification, "action")) {
                let viewNotification = JSON.parse(message.message);
                let viewAction = viewNotification.action;
                let notificationAlarmId = viewNotification.alarmId;
                thunkAPI.dispatch(setAction(viewAction));
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
