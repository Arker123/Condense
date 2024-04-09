import React, { useState, useEffect } from "react";
import {
  fetchOneSummary,
  fetchFavSummaries,
  fetchAllSummaries,
  getAllNotes,
  getNote,
} from "../https/index";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from "../components/shared/Card/ProfileCard";
import axios from "axios";
import Sidebar from "../components/shared/Sidebar";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { IoIosNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const dummySummaries = [
    {
      _id: "1",
      videoId: "youtube.com/hello",
      createdAt: "19-01-2024",
      updatedAt: "19-01-2024",
      summary: {
        body: "This is a two-line summary.\nIt's line two!",
      },
    },
    {
      _id: "2",
      videoId: "youtube.com/bye",
      createdAt: "20-01-2024",
      updatedAt: "20-01-2024",
      summary: {
        body: "Another two-line summary.\nSecond line here!",
      },
    },
    {
      _id: "3",
      videoId: "youtube.com/test",
      createdAt: "21-01-2024",
      updatedAt: "21-01-2024",
      summary: {
        body: "Testing, testing, 1, 2, 3.\nSummary line two, we're free!",
      },
    },
    {
      _id: "4",
      videoId: "youtube.com/random",
      createdAt: "22-01-2024",
      updatedAt: "22-01-2024",
      summary: {
        body: "Mock summary of something random.\nLine two, let's add some fandom!",
      },
    },
    {
      _id: "5",
      videoId: "youtube.com/one",
      createdAt: "23-01-2024",
      updatedAt: "23-01-2024",
      summary: {
        body: "One more summary in two lines.\nSecond line with some rhymes!",
      },
    },
    {
      _id: "6",
      videoId: "youtube.com/two",
      createdAt: "24-01-2024",
      updatedAt: "24-01-2024",
      summary: {
        body: "Two-line summary, six in a row.\nAdding more, let's make it grow!",
      },
    },
    {
      _id: "7",
      videoId: "youtube.com/three",
      createdAt: "25-01-2024",
      updatedAt: "25-01-2024",
      summary: {
        body: "Three's the charm, so they say.\nAnother summary to end the day!",
      },
    },
  ];
  const [activeTab, setActiveTab] = useState("Favorite Summaries");
  const user = useSelector((state) => state.user);
  const [favSummaries, setFavSummaries] = useState(dummySummaries);
  const [favNotes, setFavNotes] = useState([]);

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
      // handleGetfavSummaries();
      // handleGetAllNotes();
  }, []); // Fetch summaries when the component mounts

  const handleGetfavSummaries = async () => {
    console.log("in handlegetfavsummaries");
    const data = {
      userId: user.id,
    };
    try {
      const response = await fetchFavSummaries(data);
      setFavSummaries(response); // Assuming response contains an array of summaries
      console.log(response);
      toast.success("Successfully retrieved all fav summaries", toastOptions);
      alert("Successfully retrieved all fav summaries");
      console.log(data);
    } catch (err) {
      alert(`Failed to get all fav summaries: ${err}`);
      toast.error("Failed to get all fav summaries", toastOptions);
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
              <button className="bg-blue-400 text-black px-4 py-2 w-full mt-2 rounded-md hover:bg-gray-300 hover:text-gray-800 transition-colors duration-300 ease-in-out">
                Update Password
              </button>
            </div>
          </div>
        </div>
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
                  {favNotes.map((summary) => (
                    <ProfileCard key={summary._id} summary={summary} />
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
