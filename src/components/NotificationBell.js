import { useEffect, useState } from "react";
import socket from "../socket";
import { getProfileData } from "../common/commonApis";
import { baseURI } from "../common/baseURI";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    socket.on("getNotification", async (data) => {
      const userData = await getProfileData(data?.senderId);
      console.log("userData>>",userData)
      const combinedNotification = {
        ...userData,
        ...data,
      };
      setNotifications((prev) => [combinedNotification, ...prev]);
    });
    return () => {
      socket.off("getNotification");
    };
  }, []);


  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative focus:outline-none"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md w-40 z-10">
          {notifications.length === 0 ? (
            <p className="p-2 text-gray-500">No notifications</p>
          ) : (
            notifications.map((noti, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition rounded-md"
              >
                <img
                  src={baseURI+`/${noti.image}`}
                  alt={noti.userName}
                  className="w-6 h-6 rounded-full object-cover border"
                />

                <div className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">
                    {noti.userName}
                  </span>{" "}
                  <span className="text-gray-600">
                    {noti.type === "like" && "liked your post."}
                    {noti.type === "comment" && "commented on your post."}
                    {noti.type === "follow" && "started following you."}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
