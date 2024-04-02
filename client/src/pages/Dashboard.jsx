import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { motion } from "framer-motion";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
const Dashboard = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);

  const [selectedButton, setSelectedButton] = useState("YouTube Summary");
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const renderContent = () => {
    switch (selectedButton) {
      case "YouTube Summary":
        return (
          <div className="bg-white h-[310px] ml-[250px] w-[800px] flex flex-col mt-[50px] rounded-2xl">
            <motion.p
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-extrabold text-[55px] font-serif flex items-center justify-center mt-7"
            >
              Absorb Videos Better Now
            </motion.p>
            <div className="flex flex-row gap-4">
              <input
                type="link"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                placeholder="Paste Youtube Video link Here!"
                className="ml-[50px] pl-2 mt-[60px] text-black bg-gray-200 text-small h-[65px] w-[490px] rounded-xl overflow-hidden"
              />
              <button
                onClick={() => {
                  navigate("/summary", { state: url });
                }}
                className="cursor-pointer text-black bg-gradient-to-b from-red-400 to-red-900 rounded-xl shadow-lg w-[150px] h-[50px] mt-[68px]"
              >
                Start Summarizing
              </button>
            </div>
          </div>
        );
      case "Audio to Summary":
        return (
          <div className="bg-white h-[310px] w-[800px] ml-[250px] flex flex-col mt-[50px] rounded-2xl">
            <motion.p
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-extrabold text-[55px] font-serif flex items-center justify-center mt-7"
            >
              Absorb Audio Better Now
            </motion.p>
            <div className="flex flex-row gap-4">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudio(e.target.files[0])}
                className="ml-[50px] pl-2 mt-[60px] text-black bg-gray-200 text-small h-[50px] w-[490px] rounded-xl overflow-hidden"
              />
              <button
                onClick={() => {
                  navigate("/summary", { state: audio });
                }}
                className="cursor-pointer text-black bg-gradient-to-b from-red-400 to-red-900 rounded-xl shadow-lg w-[150px] h-[50px] mt-[60px]"
              >
                Start Summarizing
              </button>
            </div>
          </div>
        );
      case "Video to Summary":
        return (
          <div className="bg-white h-[310px] w-[800px] ml-[250px] flex flex-col mt-[50px] rounded-2xl">
            <motion.p
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-extrabold text-[55px] font-serif flex items-center justify-center mt-7"
            >
              Absorb Videos Better Now
            </motion.p>
            <div className="flex flex-row gap-4">
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => setVideo(e.target.files[0])}
                className="ml-[50px] pl-2 mt-[60px] text-black bg-gray-200 text-small h-[50px] w-[490px] rounded-xl overflow-hidden"
              />
              <button
                onClick={() => {
                  navigate("/summary", { state: video });
                }}
                className="cursor-pointer text-black bg-gradient-to-b from-red-400 to-red-900 rounded-xl shadow-lg w-[150px] h-[50px] mt-[60px]"
              >
                Start Summarizing
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleRedirect = () => {
    navigate("/contact");
  };

  const handleProfileRedirect = () => {
    navigate("/profile");
  };

  return (
    <>
      <section className="flex flex-row gap-6  bg-gradient-to-b from-black to-[#6f0000] h-screen">
        <Sidebar />
        <div>
          <div className=" flex flex-row ml-[800px] pl-20 gap-4 mt-5">
            <div className="w-30 h-10  rounded-3xl bg-white flex items-center px-4 hover:bg-gray-200">
              <div className="flex flex-row gap-2" onClick={handleRedirect}>
                <FiPhoneCall className="mt-1" />
                <p className="cursor-pointer">Contact us</p>
              </div>
            </div>

            <div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full">
              <IoMdSettings />
            </div>

            <div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full">
              <IoIosNotifications />
            </div>

            <div
              className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full  cursor-pointer"
              onClick={handleProfileRedirect}
            >
              <CgProfile />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white h-[50px] w-[600px] ml-[250px] mt-[100px] flex flex-row justify-evenly rounded-2xl">
              <button
                className={`text-sm text-black font-medium px-4 py-2 rounded-md border border-gray-300 ${
                  selectedButton === "YouTube Summary" ? "bg-red-500" : ""
                }`}
                onClick={() => handleButtonClick("YouTube Summary")}
              >
                YouTube Summary
              </button>
              <button
                className={`text-sm text-black font-medium px-4 py-2 rounded-md border border-gray-300 ${
                  selectedButton === "Audio to Summary" ? "bg-red-500" : ""
                }`}
                onClick={() => handleButtonClick("Audio to Summary")}
              >
                Audio to Summary
              </button>
              <button
                className={`text-sm text-black font-medium px-4 py-2 rounded-md border border-gray-300 ${
                  selectedButton === "Video to Summary" ? "bg-red-500" : ""
                }`}
                onClick={() => handleButtonClick("Video to Summary")}
              >
                Video to Summary
              </button>
            </div>
            {renderContent()}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Dashboard;
