// socket.js
import { io } from "socket.io-client";
import { baseURI } from "./common/baseURI";
// const socket = io("http://localhost:5000",{
//   withCredentials: true
// });
const socket = io(baseURI,{
  withCredentials: true
});
export default socket;
