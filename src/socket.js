// socket.js
import { io } from "socket.io-client";
// const socket = io("http://localhost:5000",{
//   withCredentials: true
// });
const socket = io("https://dev-connector-client1.netlify.app",{
  withCredentials: true
});
export default socket;
