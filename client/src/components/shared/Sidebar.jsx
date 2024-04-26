import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { Link } from "react-router-dom";
import { BsChatFill } from "react-icons/bs";
import { FaNoteSticky } from "react-icons/fa6";
import { MdSummarize } from "react-icons/md";
import { IoExtensionPuzzle } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";

const Sidebar = () => {
  const menus = [
    { name: "Dashboard", link: "/dashboard", icon: IoMdHome },
    { name: "Chat with AI", link: "/", icon: BsChatFill },
    { name: "My Notes and Summaries", link: "/mynotesandsummaries", icon: FaNoteSticky },
    { name: "Youtube Summaries", link: "/", icon: MdSummarize },
    { name: "Chrome Extension", link: "/", icon: IoExtensionPuzzle },
  ];
  const [open, setOpen] = useState(true);

    return (
      <div
        className={`bg-slate-50 rounded-r-lg h-screen ${
          open ? "w-68" : "w-16"
        } duration-500 text-gray-500 px-4 absolute `}
        style={{position: 'inherit'}}
      >
        <div className="flex flex-row ">


        <div className={`${open?'visible':'hidden'} flex flex-row gap-2  text-black font-extrabold font-weight-200`} >
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
      </div>);
};

export default Sidebar;