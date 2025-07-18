import axios from "axios";
import { toast } from "react-toastify";

export const handleLogout = async (navigate) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/logout");
      localStorage.removeItem("userId");
      toast.success(res.data.msg);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };