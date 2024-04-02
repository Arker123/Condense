import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoIosNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import { BsChatFill } from "react-icons/bs";
import { FaNoteSticky } from "react-icons/fa6";
import { MdSummarize } from "react-icons/md";
import { IoExtensionPuzzle } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { IoMdHome } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { motion } from "framer-motion";
import Footer from '../components/shared/Footer'
const MyNotes = () => {
    const menus = [
        { name: "dashboard", link: "/", icon: IoMdHome },
        { name: "Chat with AI", link: "/", icon: BsChatFill },
        { name: "My Notes", link: "/mynotes", icon: FaNoteSticky },
        { name: "Youtube Summaries", link: "/", icon: MdSummarize },
        { name: "Chrome Extension", link: "/", icon: IoExtensionPuzzle },
      ];
      const [open, setOpen] = useState(true);
    const navigate = useNavigate()
  return (
   
      <>
        <div className="bg-gradient-to-b from-black  to-[#6f0000] h-screen overflow: auto flex ">
          
          <div
          className={`bg-white rounded-r-lg h-screen ${
            open ? "w-68" : "w-16"
          } duration-500 text-gray-500 px-4 absolute `}
        >
          <div className="flex flex-row ">
          <p className={`${open?'visible':'hidden'} flex flex-row gap-2  text-black font-bold `} >
            <img src={'/images/logo_condense.jpg'} className="w-[25px] h-[25px] rounded-full object-cover mt-3.5"/><div className="mt-2 text-[25px]">Condense</div></p>
           <div className="py-3 flex justify-end">
            <HiMenuAlt3
              size={26}
              className={`cursor-pointer ${open ? "ml-[70px]" : "ml-[0px]"}`}
              onClick={() => setOpen(!open)}
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
                    !open && "opacity-0 translate-x-28 overflow-hidden hover:text-blue-600"
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
        <div className={`w-full flex flex-row ${ open ? 'ml-[360px] w-[950px]  flex-wrap h-[2000px] bg-gradient-to-b from-red-500 via-red-900 to-black':'ml-[30px]'}`}>
            <div className="bg-gray-200 rounded-md w-[400px] h-[390px] ml-[70px] mt-10 ">
                <div className="flex flex-col ml-[25px] ">
                <img src={'/images/image1.jpeg'} className="w-[350px] h-[250px] rounded-md mt-4"/>
                <p className="text-black font-medium text-[16px] w-[350px] mt-3 ">Bohemian Rhapsody | Muppet Music Video | The Muppets</p>
                <div className="flex flex-row items-center justify-between">
                <p className="text-black hover:text-red-900 text-[18px] font font-medium mt-3 hover:font-bold cursor-pointer" onClick={() => {  navigate("/summary")}}>Summary</p>
                <MdDeleteOutline className="mr-5 text-[35px] hover:text-red-900 cursor-pointer"/>
                </div>
                </div>
            </div>
             
            <div className="bg-gray-200 rounded-md w-[400px] h-[390px] ml-[70px] mt-10 ">
                <div className="flex flex-col ml-[25px] ">
                <img src={'/images/image3.jpeg'} className="w-[350px] h-[250px] rounded-md mt-4"/>
                <p className="text-black font-medium text-[16px] w-[350px] mt-3 ">Postman Beginner's Course - API Testing</p>
                <div className="flex flex-row items-center justify-between mt-6">
                <p className="text-black hover:text-red-900 text-[18px] font font-medium mt-3 hover:font-bold cursor-pointer" onClick={() => {  navigate("/summary")}}>Summary</p>
                <MdDeleteOutline className="mr-5 text-[35px] hover:text-red-900 cursor-pointer"/>
                </div>
                </div>
            </div>
  
            <div className="bg-gray-200 rounded-md w-[400px] h-[390px] ml-[70px] mt-10 ">
                <div className="flex flex-col ml-[25px] ">
                <img src={'/images/image2.jpeg'} className="w-[350px] h-[250px] rounded-md mt-4"/>
                <p className="text-black font-medium text-[16px] w-[350px] mt-3 ">Build and Deploy a Modern Web 3.0 Blockchain App | Solidity, Smart Contracts, Crypto</p>
                <div className="flex flex-row items-center justify-between">
                <p className="text-black hover:text-red-900 text-[18px] font font-medium mt-3 hover:font-bold cursor-pointer" onClick={() => {  navigate("/summary")}}>Summary</p>
                <MdDeleteOutline className="mr-5 text-[35px] hover:text-red-900 cursor-pointer"/>
                </div>
                </div>
            </div>
        </div>
          </div>
          <Footer/>
      </>
    
     
  );
};

export default MyNotes;
