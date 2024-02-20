import React, { useState } from "react";
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
import image from './img4.jpg';
import { FiPhoneCall } from "react-icons/fi";
import { motion } from "framer-motion";
const Home = () => {
  const menus = [
    { name: "dashboard", link: "/", icon: IoMdHome },
    { name: "Chat with AI", link: "/", icon: BsChatFill },
    { name: "My Notes", link: "/", icon: FaNoteSticky },
    { name: "Youtube Summaries", link: "/", icon: MdSummarize },
    { name: "Chrome Extension", link: "/", icon: IoExtensionPuzzle },
  ];
  const [open, setOpen] = useState(true);

  return (
   
      <section className="flex gap-6  bg-gradient-to-b from-red-400 via-red-900 to-gray-950 h-screen">
      <div
        className={`bg-white rounded-r-lg h-screen ${
          open ? "w-68" : "w-16"
        } duration-500 text-gray-500 px-4 absolute `}
      >
        <div className="flex flex-row ">
        <p className={`${open?'visible':'hidden'} flex flex-row gap-2  text-black font-bold `} >
          <img src={image} className="w-[25px] h-[25px] rounded-full object-cover mt-3.5"/><div className="mt-2 text-[25px]">Condense</div></p>
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
      
      <div>
      <div className=" flex flex-row items-center justify-center gap-4 mt-5  ml-[1150px]">
      <div className="w-30 h-10  rounded-3xl bg-white flex items-center px-4">
  
  <div className=" flex flex-row gap-2"><FiPhoneCall className="mt-1" /> <p>Contact us</p></div>
  
</div>
 
<div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full">
  <IoMdSettings />
</div>

<div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full">
<IoIosNotifications/>
</div>

<div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full"><CgProfile/></div>


     

      </div>
      {/* <div className="flex items-center justify-center h-screen"> */}
    <div className="bg-white h-[310px] w-[800px] ml-[400px] flex flex-col mt-[150px] rounded-2xl">
    {/* <p className="text-extrabold text-[55px] font-serif flex items-center justify-center mt-7">Absorb Videos Better Now</p> */}
    <motion.p
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="text-extrabold text-[55px] font-serif flex items-center justify-center mt-7"
      >
        Absorb Videos Better Now
      </motion.p>
    <div className="flex flex-row gap-4">
    <input type="link" placeholder="   Paste Youtube Video link Here!" className="ml-[50px] mt-[60px] text-black bg-gray-200 text-small h-[65px] w-[490px] rounded-xl overflow-hidden"/>
    <button to='/' className="cursor-pointer text-black bg-gradient-to-b from-red-400 to-red-900 rounded-xl shadow-lg w-[150px] h-[50px] mt-[68px]">Start Summarizing</button>
    </div>
    </div>

      </div>
     
      
    </section>
    
     
  );
};

export default Home;
