import React from 'react'
import { motion } from "framer-motion";
import { useLocation } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const SummaryAndNotes = () => {
  // Use useLocation hook to access location state
  const location = useLocation();
  const navigate = useNavigate();
  const { title, note, summary, youtubeUrl } = location.state;

  const handleRedirect = () => {
    navigate('/contact');
  };

  const handleProfileRedirect = () => {
    navigate('/profile');
  };

  console.log(youtubeUrl);
  const getVideoId = (url) => {
    const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : null;
  };

    const handleVideoUrl = (url) => {
        const videoId = getVideoId(url);
        const videoUrl = "https://www.youtube.com/embed/" + videoId;
        return videoUrl;
    };

  return (
    <div className="">
      <motion.div
        className=" flex flex-col h-[1000px] justify-center items-center bg-gradient-to-b from-black to-[#6f0000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full h-[1000px] bg-gradient-to-b from-[#100b08] to-[#6f0000] ">
          <div className="flex flex-col w-full h-[1000px] bg-none p-12">
            <div className="flex flex-row items-center justify-between mb-8">
              {/* Heading on the left */}
              <h1 className="text-3xl font-bold text-white">{title}</h1>

              {/* Icons on the right */}
              <div className="flex flex-row items-center gap-4 mr-14">
                <div className="w-30 h-10 rounded-3xl bg-white flex items-center px-4 hover:bg-gray-200">
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

                <div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full cursor-pointer" onClick={handleProfileRedirect}>
                  <CgProfile />
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full bg-none max-h-[600px]">
              <div className="w-1/2 bg-white rounded-lg mr-4">
                <div className=" items-center justify-center bg-none">
                  <div className="relative" style={{ paddingTop: "56.25%" }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={handleVideoUrl(youtubeUrl)}
                      title="YouTube video player"
                      frameBorder="0"
                      autoPlay
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
              <div className="w-1/2 bg-white rounded-lg ml-4 pl-4 pr-4 pt-4 overflow-y-scroll whitespace-normal">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-left text-4xl font-bold sticky top-0 bg-white text-brown-800 flex items-center justify-between font-league-gothic text-red-900">
                    NOTES
                  </h2>
                </div>
                <div data-testid="note-test" className="max-w-[400px] whitespace-normal">
                  {note}
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full bg-none max-h-[600px] mt-12">
                <div
                    className="w-full bg-white rounded-lg pl-4 pr-4 pt-4 overflow-y-scroll"
                    style={{ height: "400px" }}
                >
                    <div className="flex justify-between items-center mb-4 ">
                        <h2 className="text-left text-4xl font-bold sticky top-0 bg-white text-brown-800 flex items-center justify-between font-league-gothic text-red-900">
                          SUMMARY
                        </h2>
                    </div>
                    <div data-testid="summary-test" className="text-wrap">{summary}</div>
                </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SummaryAndNotes