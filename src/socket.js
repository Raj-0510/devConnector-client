// socket.js
import { io } from "socket.io-client";
// const socket = io("http://localhost:5000",{
//   withCredentials: true
// });
const socket = io("https://devconnector-1-backend.onrender.com",{
  withCredentials: true
});
export default socket;
