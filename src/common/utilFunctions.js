import axios from "axios";
import { toast } from "react-toastify";
import { baseURI } from "./baseURI";

export const handleLogout = async (navigate) => {
  try {
    const res = await axios.post(baseURI + "/api/auth/logout");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success(res.data.msg);
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
