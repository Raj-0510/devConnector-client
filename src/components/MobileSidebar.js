import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../common/utilFunctions";
import CreatePostModal from "./CreatePostModal";
import NotificationBell from "./NotificationBell";
import SearchBar from "./SearchBar";

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between py-4 px-2 border-b">
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">
          DevConnector
        </Link>
        <div className="flex gap-3">
          <NotificationBell />
        
        <button onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
        </div>
      </div>
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setOpen(false)}
          ></div>

          <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col space-y-4">
             <SearchBar/>
              <Link
                to="/network"
                className="font-medium bg-gray-100 text-gray-800 hover:bg-blue-300 w-full mx-auto rounded text-center"
              >
                My Network
              </Link>
              <button
                className="font-medium bg-gray-100 text-gray-800 hover:bg-blue-300 w-full mx-auto rounded text-center"
                onClick={() => setShowModal(true)}
              >
                Add Post
              </button>
              <Link
                to="/profile"
                className="font-medium bg-gray-100 text-gray-800 hover:bg-blue-300 w-full mx-auto rounded text-center"
              >
                Profile
              </Link>
              <button
                className="font-medium flex items-center justify-center gap-2 bg-gray-100 text-gray-800 hover:bg-blue-300 w-full rounded text-center mx-auto"
                onClick={() => handleLogout(navigate)}
              >
                Logout <LogOut className="w-4 h-4" />{" "}
              </button>
            </div>
          </div>
          {showModal ? (
            <CreatePostModal
              showModal={showModal}
              setShowModal={setShowModal}
            />
          ) : null}
        </>
      )}
    </>
  );
};

export default MobileSidebar;
