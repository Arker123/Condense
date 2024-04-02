import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoIosNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { BsChatFill } from "react-icons/bs";
import { FaNoteSticky } from "react-icons/fa6";
import { MdSummarize } from "react-icons/md";
import { IoExtensionPuzzle } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { IoMdHome } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { motion } from "framer-motion";
const Dashboard = () => {

  const navigate = useNavigate();
  const [url,setUrl] = useState("")
  const [audio,setAudio] = useState(null)
  const [video , setVideo] = useState(null)

  const [selectedButton, setSelectedButton] = useState("YouTube Summary");
  const menus = [
    { name: "Dashboard", link: "/", icon: IoMdHome },
    { name: "Chat with AI", link: "/", icon: BsChatFill },
    { name: "My Notes", link: "/", icon: FaNoteSticky },
    { name: "Youtube Summaries", link: "/", icon: MdSummarize },
    { name: "Chrome Extension", link: "/", icon: IoExtensionPuzzle },
  ];
  const [open, setOpen] = useState(true);
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const renderContent = () => {
    switch (selectedButton) {
      case "YouTube Summary":
        return (
          <div className="bg-white h-[310px] w-[800px] ml-[450px] flex flex-col mt-[50px] rounded-2xl">
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
                onChange={(e)=>setUrl(e.target.value)}
                value={url}
                placeholder="Paste Youtube Video link Here!"
                className="ml-[50px] pl-2 mt-[60px] text-black bg-gray-200 text-small h-[65px] w-[490px] rounded-xl overflow-hidden"
              />
              <button
                onClick={()=>{navigate('/summary',{state:url})}}
                className="cursor-pointer text-black bg-gradient-to-b from-red-400 to-red-900 rounded-xl shadow-lg w-[150px] h-[50px] mt-[68px]"
              >
                Start Summarizing
              </button>
            </div>
          </div>
        );
        case "Audio to Summary":
          return (
            <div className="bg-white h-[310px] w-[800px] ml-[450px] flex flex-col mt-[50px] rounded-2xl">
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
                  onClick={()=>{navigate('/summary',{state:audio})}}
                  className="cursor-pointer text-black bg-gradient-to-b from-red-400 to-red-900 rounded-xl shadow-lg w-[150px] h-[50px] mt-[60px]"
                >
                  Start Summarizing
                </button>
              </div>
            </div>
          );
        case "Video to Summary":
          return (
            <div className="bg-white h-[310px] w-[800px] ml-[450px] flex flex-col mt-[50px] rounded-2xl">
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
                  onClick={()=>{navigate('/summary',{state:video})}}
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
    navigate('/contact');
  };

  const handleProfileRedirect = () => {
    navigate('/profile');
  };

  return (
    <section className="flex gap-6  bg-gradient-to-b from-red-400 via-red-900 to-gray-950 h-screen">
      <div
        className={`bg-white rounded-r-lg h-screen ${
          open ? "w-68" : "w-16"
        } duration-500 text-gray-500 px-4 absolute `}
      >
        <div className="flex flex-row ">
        
        <div className={`${open?'visible':'hidden'} flex flex-row gap-2  text-black font-bold `} >
          <img src={'/images/logo_condense.jpg'} className="w-[25px] h-[25px] rounded-full object-cover mt-3.5" data-testid = "condense-logo"/><div className="mt-2 text-[25px]">Condense</div></div>
         <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className={`cursor-pointer ${open ? "ml-[70px]" : "ml-[0px]"}`}
            onClick={() => setOpen(!open)}
            data-testid = "SidebarButton"
          />
        </div>
       
        </div>
        <div className={`mt-4 flex flex-col   gap-4 relative `}>
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={` ${
                menu?.margin && "mt-5"
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-200 hover:border-4 hover:text-blue-600 hover:border-l-indigo-500 rounded-md`}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open &&
                  "opacity-0 translate-x-28 overflow-hidden hover:text-blue-600"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                }  absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden   group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      <div className="">
        <div className=" flex flex-row items-center justify-center gap-4 mt-5  ml-[1150px]">
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

          <div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full  cursor-pointer" onClick={handleProfileRedirect}>
            <CgProfile />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
        <div className="bg-white h-[50px] w-[600px] ml-[450px] mt-[100px] flex flex-row justify-evenly rounded-2xl">
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
  );
};

export default Dashboard;
