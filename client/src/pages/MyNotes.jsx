import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from '../components/Footer'
const MyNotes = () => {
    const navigate = useNavigate()
  return (
   
      <>
        <div className="bg-gradient-to-b from-black  to-[#6f0000] h-screen overflow: auto flex ">
        <Sidebar />
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
