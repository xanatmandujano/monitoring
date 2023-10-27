import { createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
//Slice
import { setMessage } from "../slices/messageSlice";
import {
  setAlarmNotification,
  setAlarmsCount,
  setNewAlarm,
} from "../slices/alarmsSlice";
//Services
import {
  getTodayAlarms,
  getAlarmAttachments,
  getAlarmData,
} from "../../services/alarmsService";
//Signalr
import { HubConnectionBuilder } from "@microsoft/signalr";

export const todayAlarms = createAsyncThunk(
  "alarms/todayAlarms",
  async (
    { pageNumber, pageSize, columnName, sortDirection, searchText },
    thunkAPI
  ) => {
    try {
      const data = await getTodayAlarms(
        pageNumber,
        pageSize,
        columnName,
        sortDirection,
        searchText
      );
      thunkAPI.dispatch(setAlarmsCount(data.totalRecords));
      return data.result;
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

export const alarmAttachments = createAsyncThunk(
  "alarms/alarmsAttachments",
  async ({ alarmId }, thunkAPI) => {
    try {
      const data = await getAlarmAttachments(alarmId);
      return data;
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
            //console.log("Connected!");
          })
          .catch((e) => console.log(`Connection failed: ${e}`));

        newConnection.on("ReceiveMessage", (message) => {
          thunkAPI.dispatch(setAlarmNotification(JSON.parse(message.message)));
          let newAlarm = JSON.parse(message.message);
          let newAlarmCode = newAlarm.Code;

          const alarmData = async () => {
            try {
              const data = await getAlarmData(newAlarmCode).then((res) => {
                if (res.data.isSuccess) {
                  thunkAPI.dispatch(setNewAlarm(res.data.result));
                }
                //console.log(res);
              });
            } catch (error) {
              console.log(error);
            }
          };

          alarmData();
        });
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

// export const alarmData = createAsyncThunk(
//   "alarms/alarmData",
//   async ({ code }, thunkAPI) => {
//     try {
//       const data = await getAlarmData(code).then((res) => {
//         if (res.data.isSuccess) {
//           thunkAPI.dispatch(setNewAlarm(res.data.result));
//         }
//       });
//       console.log(data);
//       return data;
//     } catch (error) {
//       console.log(error);
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       thunkAPI.dispatch(setMessage(message));
//       return thunkAPI.rejectWithValue();
//     }
//   }
// );
