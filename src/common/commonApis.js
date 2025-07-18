import axios from "axios";

 export const getProfileData = async (userId) => {
    
    try {
      const url =`https://devconnector-1-backend.onrender.com/api/user-profile/get-user-profile-by-id/${userId}`;
      const response = await axios.get(url, { withCredentials: true });

      const data = response?.data?.data;
      console.log("data>>",data)
      return data

    } catch (err) {
      console.log("Error fetching profile", err);
    }
  };