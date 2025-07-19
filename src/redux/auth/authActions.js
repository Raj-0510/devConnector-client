import axios from "axios";
import { authStart, authSuccess, authFail } from "./authSlice";
import { baseURI } from "../../common/baseURI";

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(authStart());
  try {
    const res = await axios.post(`${baseURI}/api/auth/login`, credentials);
    dispatch(authSuccess(res?.data));
    const token = res.data.token;

    localStorage.setItem("token", token);
    return res?.data;
  } catch (err) {
    dispatch(authFail(err.response?.data?.message || "Login failed"));
    throw err;
  }
};

export const registeruser = (credentials) => async (dispatch) => {
  dispatch(authStart());
  try {
    const res = await axios.post(
      baseURI + "/api/auth/register",
      credentials,
      {}
    );
    dispatch(authSuccess(res.data));
    const token = res.data.token;
    localStorage.setItem("token", token);
    return res?.data;
  } catch (err) {
    dispatch(authFail(err.response?.data?.message || "Register failed"));
  }
};
