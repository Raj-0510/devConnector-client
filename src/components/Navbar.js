import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import CreatePostModal from "./CreatePostModal";
import NotificationBell from "./NotificationBell";
import { handleLogout } from "../common/utilFunctions";
import SearchBar from "./SearchBar";
import { baseURI } from "../common/baseURI";

function Navbar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [searchType, setSearchType] = useState("user");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchList, setSearchList] = useState(false);

  const wrapperRef = useRef(null);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        baseURI+"/api/user-profile/search",
        {
          params: {
            q: searchTerm,
            type: searchType,
            page: 1,
            limit: 10,
          },
        }
      );
      setSearchResults(res.data.results);
      setSearchList(true);
    } catch (error) {
      console.error("Search error:", error.response?.data || error.message);
    }
  };

  const handleUserClick = (user) => {
    navigate(`/profile`, {
      state: { _id: user?.userId },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 items-center justify-between">
      <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
        DevConnector
      </Link>

      {/* Center Section: My Network + Add Post + Search */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-6 md:space-y-0">
        <Link
          to="/network"
          className="hover:text-blue-500 transition-colors text-base font-medium"
        >
          My Network
        </Link>

        <button
          onClick={() => setShowModal(true)}
          className="hover:text-blue-500 transition-colors text-base font-medium"
        >
          Add post
        </button>
      </div>


      {/* Right Section: Profile + Logout */}
      <div className="flex items-center space-x-4">
        <SearchBar/>
        <NotificationBell/>
        <Link to="/profile" className="hover:text-blue-500 transition-colors">
          <UserRound className="w-5 h-5" />
        </Link>

        <button
          onClick={() => handleLogout(navigate)}
          className="hover:text-blue-500 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-6" />
        </button>
      </div>

      {/* Create Post Modal */}
      {showModal ? (
        <CreatePostModal showModal={showModal} setShowModal={setShowModal} />
      ) : null}
    </nav>
  );
}

export default Navbar;
