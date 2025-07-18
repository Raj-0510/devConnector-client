import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchBar({ searchType = "user", onResultSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchList, setSearchList] = useState(false);

  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const res = await axios.get(
        "https://devconnector-1-backend.onrender.com/api/user-profile/search",
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
    setSearchList(false);
    setSearchTerm("");
    onResultSelect?.(user);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSearchList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="flex md:flex-row flex-col items-center gap-2 ">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full "
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button
          className="rounded-md bg-blue-400 text-white py-1 hover:bg-blue-600 px-1 md:px-2  w-full md:w-auto mt-2 md:mt-0"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {searchTerm !== "" && searchList && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-80 overflow-y-auto">
          {searchResults.length === 0 ? (
            <p className="text-gray-500 text-sm px-4 py-2">No Results found</p>
          ) : (
            searchResults.map((user) => (
              <div
                key={user._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                onClick={() => handleUserClick(user)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://devconnector-1-backend.onrender.com/${user.image}`}
                    alt={user.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-medium">{user.userName}</h3>
                    <p className="text-xs text-gray-500">{user.bio}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
