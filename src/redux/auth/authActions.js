import axios from 'axios';
import { authStart, authSuccess, authFail } from './authSlice';
import { baseURI } from '../../common/baseURI';

export const loginUser=(credentials)=>async(dispatch)=>{
     dispatch(authStart());
      try {
    const res = await axios.post(baseURI+"/api/auth/login", credentials,{withCredentials:true});
    dispatch(authSuccess(res?.data));
    console.log("res<<",res?.data)
    return res?.data;
  } catch (err) {
    dispatch(authFail(err.response?.data?.message || "Login failed"));
    throw err
  }
}

export const registeruser=(credentials)=>async(dispatch)=>{
    dispatch(authStart());
    try{
     const res = await axios.post(baseURI+"/api/auth/register", credentials,{withCredentials:true});
    dispatch(authSuccess(res.data));
    return res?.data;

  } catch (err) {
    dispatch(authFail(err.response?.data?.message || "Register failed"));
  }
}

