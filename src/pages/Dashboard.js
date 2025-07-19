import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getProfileData } from "../common/commonApis";
import { toast } from "react-toastify";
import socket from "../socket";
import MobileSidebar from "../components/MobileSidebar";
import { baseURI } from "../common/baseURI";

function Dashboard({ from, deleteButton, userId }) {
  const [postData, setPostData] = useState([]);
  const navigate = useNavigate();
  const [showCommentsMap, setShowCommentsMap] = useState({});
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("token");

  const toggleComments = (postId) => {
    setShowCommentsMap((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = async (post) => {
    try {
      const userData = await getProfileData(localStorage.getItem("userId"));
      await axios.post(
        baseURI + `/api/feed/add-comment/${post?._id}`,
        { userName: userData?.userName, content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      socket.emit("sendNotification", {
        senderId: userData?.userId,
        receiverId: post?.userId?._id,
        type: "comment",
        postId: post?._id,
      });
      setNewComment("");
      getAllPosts();
    } catch (err) {
      console.error("Add comment failed:", err);
    }
  };

  const getAllPosts = async () => {
    try {
      const url =
        from === "postsView"
          ? baseURI + `/api/feed/get-user-posts/${userId}`
          : baseURI + "/api/feed/get-all-posts";
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      setPostData(data);
    } catch (err) {
      console.error("err>>", err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(
        baseURI + `/api/feed/delete-post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.msg);
      getAllPosts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const toggleLike = async (e, post) => {
    const userId = localStorage.getItem("userId");

    e.preventDefault();
    try {
      const response = await axios.post(
        baseURI + `/api/feed/toggle-like/${post?._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("userId>>",userId)
      console.log("post?.userId?._id>>",post?.userId?._id)


      if (response?.data?.liked) {
        socket.emit("sendNotification", {
          senderId: userId,
          receiverId: post?.userId?._id,
          type: "like",
          postId: post?._id,
        });
      }
      getAllPosts();
    } catch (err) {
      console.error("err>>", err);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <>
      {from === "postsView" ? null : (
        <>
          <div className="hidden md:block">
            {" "}
            <Navbar />
          </div>
          <div className="block md:hidden">
            <MobileSidebar />
          </div>
          <div className="max-w-3xl mx-auto mt-6 px-2 sm:px-4 space-y-6"></div>
        </>
      )}
      {postData?.length === 0 ? (
        <div className="text-center text-gray-500">
          No posts on your feed to show currently
        </div>
      ) : (
        postData?.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow w-11/12 mx-auto mb-4"
          >

            <div className="flex items-center mb-2">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    post?.profileImage
                      ? baseURI + `/${post?.profileImage}`
                      : "/default-avatar.png"
                  }
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3
                    className="font-semibold text-gray-800 text-sm sm:text-base cursor-pointer"
                    onClick={() =>
                      navigate(`/profile`, {
                        state: { _id: post?.userId?._id },
                      })
                    }
                  >
                    {post?.userName || "Unknown User"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(post?.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Delete Button at far right */}
              {deleteButton ? (
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              ) : (
                <></>
              )}
            </div>

            {/* Post content goes here */}

            {/* Title */}
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {post?.title}
            </h2>

            {/* Content */}
            <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line">
              {post?.content}
            </p>

            {/* Image */}
            {post?.image && (
              <img
                src={baseURI + `/${post?.image}`}
                alt="post"
                className="w-full rounded-md object-cover mt-3 max-h-[400px]"
              />
            )}

            {/* Actions */}
            <div className="flex flex-col">
              <div className="flex gap-6 mt-4 text-sm font-medium text-gray-500">
                <button
                  className="hover:text-blue-600 flex items-center gap-1"
                  onClick={(e) => toggleLike(e, post)}
                >
                  👍 <span>Like</span>
                </button>
                <button
                  className="hover:text-blue-600 flex items-center gap-1"
                  onClick={() => toggleComments(post?._id)}
                >
                  💬 <span>Comment</span>
                </button>
              </div>
              <div>
                {showCommentsMap[post._id] && (
                  <div className="mt-4 border-t pt-4 space-y-4 flex flex-col">
                    {/* Existing Comments */}
                    <div>
                      {post?.comments?.length > 0 ? (
                        post.comments.map((comment, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 bg-gray-50 border rounded-lg p-3 shadow-sm mb-2"
                          >
                            {/* Optional avatar icon */}
                            <div className="flex-shrink-0">
                              <div className="w-9 h-9 bg-blue-200 text-blue-700 font-bold flex items-center justify-center rounded-full ">
                                {comment?.userName?.charAt(0).toUpperCase()}
                              </div>
                            </div>

                            {/* Comment content */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-800">
                                  {comment?.userName}
                                </p>
                                {/* Optional: Add timestamp or options */}
                              </div>
                              <p className="text-gray-600 text-sm mt-1">
                                {comment?.content}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No comments yet.
                        </p>
                      )}
                    </div>
                    {/* New Comment Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 border px-3 py-1 rounded-md text-sm"
                      />
                      <button
                        onClick={() => handleAddComment(post)}
                        className="text-white bg-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default Dashboard;
