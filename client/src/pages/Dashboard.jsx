import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import "./Dashboard.css";

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
          <div className="bg-slate-50 h-[310px] w-[800px] flex flex-col mt-[50px] rounded-2xl">
            <motion.p
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-[55px] maintext flex items-center justify-center mt-8"
            >
              Absorb Videos Better Now
            </motion.p>
            <div className="flex flex-row gap-4">
              <input
                type="link"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                placeholder="Paste Youtube Video link Here!"
                className="ml-[50px] pl-2 mt-[50px] text-black bg-gray-300 text-small h-[60px] w-[490px] rounded-xl overflow-hidden placeholder-gray-500"
              />
              <button
                onClick={() => {
                  navigate("/summary", { state: url });
                }}
                className="cursor-pointer text-black bg-gradient-to-b from-red-400 to-red-900 rounded-xl shadow-lg w-[150px] h-[50px] mt-[55px] hover:underline"
              >
                Start Summarizing
              </button>
            </div>
          </div>
        );
      case "Audio to Summary":
        return (
          <div className="bg-slate-50 h-[310px] w-[800px] flex flex-col mt-[50px] rounded-2xl">
            <motion.p
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-[55px] maintext flex items-center justify-center mt-8"
            >
              Absorb Audio Better Now
            </motion.p>
            <div className="flex flex-row gap-4">
              <div className="ml-[50px] pl-2 mt-[50px] bg-gray-300 h-[60px] w-max rounded-xl items-center justify-center ">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudio(e.target.files[0])}
                  className="mt-4 text-black text-small w-[480px] overflow-hidden items-center"
                />
              </div>

              <button
                onClick={() => {
                  navigate("/summaryFile", { state: audio });
                }}
                className="cursor-pointer text-black bg-gradient-to-b from-red-400 to-red-900 rounded-xl shadow-lg w-[150px] h-[50px] mt-[55px] hover:underline"
              >
                Start Summarizing
              </button>
            </div>
          </div>
        );
      case "Video to Summary":
        return (
          <div className="bg-slate-50 h-[310px] w-[800px] flex flex-col mt-[50px] rounded-2xl">
            <motion.p
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-[55px] maintext flex items-center justify-center mt-8"
            >
              Absorb Videos Better Now
            </motion.p>
            <div className="flex flex-row gap-4">
              <div className="ml-[50px] pl-2 mt-[50px] bg-gray-300 h-[60px] w-max rounded-xl items-center justify-center ">
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={(e) => setVideo(e.target.files[0])}
                  className="mt-4 text-black text-small w-[480px] overflow-hidden items-center"
                />
              </div>

              <button
                onClick={() => {
                  navigate("/summaryFile", { state: video });
                }}
                className="cursor-pointer text-black bg-gradient-to-b from-red-400 to-red-900 rounded-xl shadow-lg w-[150px] h-[50px] mt-[55px] hover:underline"
              >
                Start Summarizing
              </button>
            </div>
          </div>
        );
        case "Live Meet":
        return (
          <div className="bg-slate-50 h-[310px] w-[800px] flex flex-col mt-[50px] rounded-2xl">
            <motion.p
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-[55px] maintext flex items-center justify-center mt-8"
            >
              Join Live Meeting
            </motion.p>
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={() => {
                  // Request permission to access microphone
                  navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(function(stream) {
                      // Microphone access granted, you can do further processing here
                      console.log('Microphone access granted');
                      // Redirect to the live meeting page
                      navigate("/live-meeting", { state: stream });
                    })
                    .catch(function(error) {
                      // Microphone access denied or error occurred
                      console.error('Error accessing microphone:', error);
                      // Handle error gracefully
                    });
                }}
                className="cursor-pointer text-black bg-gradient-to-b from-red-400 to-red-900 rounded-xl shadow-lg w-[150px] h-[50px] mt-[55px] hover:underline"
                style={{ alignSelf: "center" }} // Center the button horizontally
              >
                Join Meeting
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
        <div className="w-full flex flex-col">
          {/* Top Icons */}
          <div>
            <div className="flex groupside justify-end p-2 gap-4 mt-5 mr-4">
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
          {/* Generate Summary Content */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-slate-50 navtabs h-[50px] w-[600px] mt-[100px] flex flex-row justify-evenly rounded-2xl">
              <AnimatePresence>
                <button
                  className={`relative transition duration-200 ease-in-out text-sm text-black font-medium w-1/3 rounded-2xl`}
                  onClick={() => handleButtonClick("YouTube Summary")}
                >
                  <span className="z-10 relative">YouTube Summary</span>
                  
                  {selectedButton === "YouTube Summary" ? (
                    <motion.div
                      transition={{ type: "spring", stiffness: 50  }}
                      layoutId="underline"
                      className="absolute rounded-2xl w-full h-full left-0 bottom-0 bg-red-500 border border-slate-50"
                    ></motion.div>
                  ) : null}
                </button>
                <button
                  className={`relative transition duration-200 ease-in-out text-sm text-black font-medium w-1/3 rounded-2xl`}
                  onClick={() => handleButtonClick("Audio to Summary")}
                >
                  <span className="z-10 relative">Audio to Summary</span>
                  {selectedButton === "Audio to Summary" ? (
                    <motion.div
                      transition={{ type: "spring", stiffness: 50  }}
                      layoutId="underline"
                      className="absolute rounded-2xl w-full h-full left-0 bottom-0 bg-red-500 border border-slate-50"
                    ></motion.div>
                  ) : null}
                </button>
                <button
                  className={`relative transition duration-200  ease-in-out text-sm text-black font-medium w-1/3 rounded-2xl`}
                  onClick={() => handleButtonClick("Video to Summary")}
                >
                  <span className="z-10 relative">Video to Summary</span>
                  
                  {selectedButton === "Video to Summary" ? (
                    <motion.div
                      transition={{ type: "spring", stiffness: 50 }}
                      layoutId="underline"
                      className="absolute rounded-2xl w-full h-full left-0 bottom-0 bg-red-500 border border-slate-50"
                    ></motion.div>
                  ) : null}
                </button>
                <button
                  className={`relative transition duration-200 ease-in-out text-sm text-black font-medium w-1/3 rounded-2xl`}
                  onClick={() => handleButtonClick("Live Meet")}
                >
                  <span className="z-10 relative">Live Meet</span>
                  
                  {selectedButton === "Live Meet" ? (
                    <motion.div
                      transition={{ type: "spring", stiffness: 50  }}
                      layoutId="underline"
                      className="absolute rounded-2xl w-full h-full left-0 bottom-0 bg-red-500 border border-slate-50"
                    ></motion.div>
                  ) : null}
                </button>
              </AnimatePresence>
            </div>
            {renderContent()}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
