import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { baseURI } from "../common/baseURI";

export default function CreatePostModal({ showModal, setShowModal }) {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: null,
  });
   const token=localStorage.getItem("token");


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setPostData({ ...postData, image: files[0] });
    } else {
      setPostData({ ...postData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      if (postData.image) {
        formData.append("image", postData.image);
      }
      const response = await axios.post(
        baseURI + "/api/feed/create-post",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.msg);
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">
              Create Post
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={postData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Content</label>
                <textarea
                  name="content"
                  value={postData.content}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Write your post..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Image (optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
