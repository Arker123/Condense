import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from "../components/shared/Card/ProfileCard";
import ProfileCardNote from "../components/shared/Card/ProfileCardNote";
import axios from "axios";
import Sidebar from "../components/shared/Sidebar";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { IoIosNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import {
  updatePass
} from "../https/index";
import PasswordUpdatePopup from "../components/shared/PasswordUpdatePopUp";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Favorite Summaries");
  const user = useSelector((state) => state.user);
  console.log(user.id);
  const email = user.email;
  console.log("email=> ", email);
  const [favSummaries, setFavSummaries] = useState([]);
  const [favNotes, setFavNotes] = useState([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State for managing the visibility of the password update popup

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/contact");
  };

  const handleProfileRedirect = () => {
    navigate("/profile");
  };

  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    console.log("Fetching Data");
    handleGetfavSummaries();
    handleGetfavNotes();
  }, []); // Fetch summaries when the component mounts

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };
  
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleGetfavSummaries = async () => {
    console.log("in handlegetfavsummaries");
    const data = {
      userId: user.id,
    };
    // Construct the URL with query parameters
    const apiUrl = `${process.env.REACT_APP_API_URL}/summaries/getFav?userId=${user.id}`;

    const response = axios.get(apiUrl);
    response
      .then((response) => {
        setFavSummaries(response.data); // Assuming response contains an array of summaries
        console.log(response.data);
        toast.success("Successfully retrieved all fav summaries", toastOptions);
        // alert("Successfully retrieved all fav summaries");
        // console.log(data);
      })
      .catch((err) => {
        // alert(`Failed to get all fav summaries: ${err}`);
        toast.error("Failed to get all fav summaries", toastOptions);
        console.log(err);
      });
  };

  const handleGetfavNotes = async () => {
    console.log("in handlegetnotes");
    const data = {
      userId: user.id,
    };
    // Construct the URL with query parameters
    const apiUrl = `${process.env.REACT_APP_API_URL}/note/fav?userId=${user.id}`;

    const response = axios.get(apiUrl);
    response
      .then((response) => {
        setFavNotes(response.data.notes); // Assuming response contains an array of summaries
        console.log("fav notes:",response.data.notes);
        toast.success("Successfully retrieved all fav notes", toastOptions);
        // alert("Successfully retrieved all fav summaries");
        // console.log(data);
      })
      .catch((err) => {
        // alert(`Failed to get all fav summaries: ${err}`);
        toast.error("Failed to get all fav notes", toastOptions);
        console.log(err);
      });
  };

  const handleUpdatePassword = async () => {
    console.log("in update pas");
    const data = {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    
    try {
      const response = await updatePass(data);
      console.log(response);
      toast.success("Password updated successfully");
      setShowPopup(false); // Close the popup after successful update
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      // console.log(error);
      let errorMessage = "Error while updating";
      toast.error(errorMessage, toastOptions);
    }
  };

  return (
    <div className="flex flex-row App3">
      <div>
        <Sidebar />
      </div>
      <div className="h-dvh mainchild ml-4 pr-4">
        {/* Top Icons */}
        <div>
          <h2 className="header float-left p-4">USER PROFILE</h2>
          <div className="flex groupside justify-end p-2 gap-4 mt-5">
            <div className="w-30 h-10  sidebuttons rounded-3xl flex items-center px-4">
              <div className="flex flex-row gap-2" onClick={handleRedirect}>
                <FiPhoneCall className="mt-1" />
                <p className="cursor-pointer">Contact Us</p>
              </div>
            </div>

            <div className="w-10 h-[40px] sidebuttons flex items-center text-[30px] justify-center rounded-full">
              <IoMdSettings />
            </div>

            <div className="w-10 h-[40px] sidebuttons flex items-center text-[30px] justify-center rounded-full">
              <IoIosNotifications />
            </div>

            <div
              className="w-10 h-[40px] sidebuttons flex items-center text-[30px] justify-center rounded-full  cursor-pointer"
              onClick={handleProfileRedirect}
            >
              <CgProfile />
            </div>
          </div>
        </div>
        {/* Profile Info */}
        <div className="flex profilesection clear-both flex-col gap-2 border border-neutral-50 rounded-sm shadow-lg pb-1 mb-4">
          <div className="flex items-center gap-6 mt-1">
            <div className="profileimage">
              <img src="/images/robot-profile-icon.svg" />
              Jason Derulo
            </div>
            <div className="flex flex-col items-center gap-2 mt-1">
              <div>
                <span className="text-medium">Email ID: </span>
                <span className="text-medium font-semibold">
                  user@email.com
                </span>
              </div>
              <button 
                className="bg-blue-400 text-black px-4 py-2 w-full mt-2 rounded-md hover:bg-gray-300 hover:text-gray-800 transition-colors duration-300 ease-in-out"
                onClick={() => setShowPopup(true)}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
        {/* Popup for Updating Password */}
        {showPopup && (
          <PasswordUpdatePopup
            oldPassword={oldPassword}
            newPassword={newPassword}
            handleUpdatePassword={handleUpdatePassword}
            handleClose={() => setShowPopup(false)}
            handleOldPasswordChange={handleOldPasswordChange}
            handleNewPasswordChange={handleNewPasswordChange}
          />
        )}
        <ToastContainer />
        <div className="summarysection flex flex-col rounded-md mb-4">
          {/* Tabs */}
          <div className="flex flex-row gap-10 text-neutral-50 border-b border-gray-100 mb-2">
            <div
              className={`navtabs ${activeTab === "Favorite Summaries" ? "navtabsActive" : ""}`}
              onClick={() => handleTabClick("Favorite Summaries")}
            >
              <h3 className="text-lg font-semibold text-center">
                Favorite Summaries
              </h3>
            </div>
            <div
              className={`navtabs ${activeTab === "Favorite Notes" ? "navtabsActive" : ""}`}
              onClick={() => handleTabClick("Favorite Notes")}
            >
              <h3 className="text-lg font-semibold text-center">
                Favorite Notes
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="content text-neutral-50 p-1">
            {activeTab === "Favorite Summaries" && (
              <div className="text-red-900 h-full mb-4 text-1xl">
                {/* Content for Favorite Summaries tab */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {favSummaries.map((summary) => (
                    <ProfileCard key={summary._id} summary={summary} />
                  ))}
                  {favSummaries.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <p className="text-gray-600">
                        There's nothing to show here! Favourite a summary to
                        view it here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === "Favorite Notes" && (
              <div className="text-red-900 h-full mb-4 text-1xl">
                {/* Content for Favorite Notes tab */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {favNotes.map((note) => (
                    <ProfileCardNote key={note._id} note={note} />
                  ))}
                  {favNotes.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <p className="text-gray-600">
                        There's nothing to show here! Favourite a note to view
                        it here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
