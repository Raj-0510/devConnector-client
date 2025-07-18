import axios from "axios";
import { baseURI } from "./baseURI";

export const getProfileData = async (userId) => {
  try {
    const token=localStorage.getItem("token");

    const url = baseURI + `/api/user-profile/get-user-profile-by-id/${userId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response?.data?.data;
    return data;
  } catch (err) {
    console.log("Error fetching profile", err);
  }
};
