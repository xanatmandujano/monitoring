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

// class Connector {
//   constructor() {
//     this.connection = new signalR.HubConnectionBuilder()
//       .withUrl(`${hubUrl}/hubs/notifications`)
//       .withAutomaticReconnect()
//       .build();
//     this.connection.start().catch((error) => console.log(error));
//     this.events = (onMessageReceived) => {
//       this.connection.on("ReceiveMessage", (message) => {
//         onMessageReceived(message);
//       });
//     };
//   }
//   newMessage = (sendType, message) => {
//     this.connection
//       .send(sendType, message)
//       .then(() => console.log("Message sent"));
//   };

//   getInstance = () => {
//     if (!Connector.instance) {
//       Connector.instance = new Connector();
//       return Connector.instance;
//     }
//   };
// }

//export default Connector.getInstance;
