import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function DeleteProfileModalOpen({ showModal, setShowModal }) {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
      const userId=localStorage.getItem("userId");
    
    try {
      const response = await axios.delete(
        `https://devconnector-1-backend.onrender.com/api/user-profile/delete-user-profile/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.msg);
      setShowModal(false);
      navigate("/")
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white max-w-screen-lg min-h-[100px] rounded-xl shadow-lg p-6 relative">
          

            <h3 className="text-center text-red-600 font-semibold text-lg mt-1">
              Are you sure you want to delete your profile
            </h3>
 <div className="flex justify-between gap-6 mt-8">
        <button
          onClick={handleSubmit}
          className="text-white bg-green-600 ml-6 hover:bg-green-700 rounded-md px-5 py-2 transition"
        >
          Yes
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="text-white bg-red-600 mr-6 hover:bg-red-700 rounded-md px-5 py-2 transition"
        >
          No
        </button>
      </div>

          </div>
        </div>
      )}
    </>
  );
}
