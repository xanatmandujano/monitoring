import { createAsyncThunk } from "@reduxjs/toolkit";
//Slices
import { setMessage } from "../slices/messageSlice";
import { setNewAlarm } from "../slices/notificationsSlice";
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
            //console.log("Connected with store!");
            newConnection.on("ReceiveMessage", (message) => {
              let newAlarm = JSON.parse(message.message);
              let newAlarmCode = newAlarm.Code;
              //console.log(newAlarm);

              const alarmData = async () => {
                try {
                  const data = await getAlarmData(newAlarmCode).then((res) => {
                    if (res.data.isSuccess) {
                      thunkAPI.dispatch(setNewAlarm(res.data.result));
                      return res.data.result;
                    }
                  });
                } catch (error) {
                  console.log(error);
                }
              };

              alarmData();
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
