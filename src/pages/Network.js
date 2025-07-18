import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import MobileSidebar from "../components/MobileSidebar";
import { baseURI } from "../common/baseURI";

function Network() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const getConnectionsList = async () => {
    try {
      const response = await axios.get(baseURI + "/api/profiles/connections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      setFollowers(data.followers || []);
      setFollowing(data.following || []);
    } catch (err) {
      console.error("err>>", err);
    }
  };

  const getAllUsersList = async () => {
    try {
      const response = await axios.get(
        "https://devconnector-1-backend.onrender.com/api/profiles/",
        {
          withCredentials: true,
        }
      );
      const data = response?.data;
      setSuggestions(data || []);
    } catch (err) {
      console.error("err>>", err);
    }
  };

  useEffect(() => {
    getConnectionsList();
    getAllUsersList();
  }, []);

  const renderUserCard = (user, type = "suggestion") => (
    <div
      key={user._id}
      className="flex items-center gap-4 p-4 rounded-xl border bg-white shadow hover:shadow-md transition duration-300"
    >
      <img
        src={baseURI + `/${user.image}`}
        alt={user.userName}
        className="w-14 h-14 rounded-full object-cover border"
      />
      <div>
        <h3
          className="text-lg font-semibold"
          onClick={() =>
            navigate(`/profile`, {
              state: { from: "network", _id: user?.userId },
            })
          }
        >
          {user.userName}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">{user.bio}</p>
        <p className="text-blue-600 text-sm mt-1 font-medium">
          Skills: {user.skills}
        </p>
      </div>
      {type === "followers" ? (
        <></>
      ) : (
        <button
          onClick={() => toggleFollow(user?.userId)}
          className={`px-4 py-1 rounded-md text-sm font-medium ${
            type !== "suggestion"
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }`}
        >
          {type !== "suggestion" ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );

  const toggleFollow = async (targetUserId) => {
    try {
      const response = await axios.get(
        baseURI + `/api/profiles/${targetUserId}/follow`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.msg);
      //     console.log("response>>",response)
      //     if(response?.data?.success){
      // const userId = localStorage.getItem("userId");
      //       socket.emit("sendNotification", {
      //         senderId: userId,
      //         receiverId: targetUserId,
      //         type: "follow",
      //       });
      //     }
      getConnectionsList();
      getAllUsersList();
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  return (
    <>
      <div className="hidden md:block">
        {" "}
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileSidebar />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 ">My Network</h1>

          {/* Followers */}
          <section className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Followers
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {followers.length > 0 ? (
                followers.map((user) => renderUserCard(user, "followers"))
              ) : (
                <p className="text-gray-500">No followers yet.</p>
              )}
            </div>
          </section>

          {/* Following */}
          <section className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Following
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {following.length > 0 ? (
                following.map((user) => renderUserCard(user, "following"))
              ) : (
                <p className="text-gray-500">Not following anyone yet.</p>
              )}
            </div>
          </section>

          {/* Suggestions */}
          <section className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              People You May Know
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.length > 0 ? (
                suggestions.map((user) => renderUserCard(user))
              ) : (
                <p className="text-gray-500">No suggestions at the moment.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Network;
