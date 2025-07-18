import './App.css';
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from './routes/AppRoutes';
import socket from './socket';
import { useEffect } from 'react';


function App() {

useEffect(() => {
  const userId = localStorage.getItem("userId");

  const registerUser = () => {
    console.log("in register User")
    if (userId) {
      socket.emit("register", userId);
    }
  };

  socket.on("connect", registerUser);

  socket.on("reconnect", registerUser);

  return () => {
    socket.off("connect", registerUser);
    socket.off("reconnect", registerUser);
  };
}, []);


  return (
   <Router>
   <ToastContainer position="top-center" autoClose={1500} hideProgressBar={true} />
   <AppRoutes />
   </Router>
  );
}

export default App;
 