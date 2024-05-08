// SummaryPage.js
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faStar } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import { LuDownload } from "react-icons/lu";
import {
  modifyNote,
  createNote,
  deleteNote,
  modifyFavSummaries,
  saveSummary,
  getUser,
  modifyFavNotes,
} from "../https/index";
import { useDispatch, useSelector } from "react-redux";
import JSON5 from "json5";
import { setUserSlice } from "../redux/userSlice";
import MyChatBot from "../components/shared/Chatbot/Chatbot";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { FaWandMagicSparkles } from "react-icons/fa6";

const SummaryPage = () => {
  const [summaryText, setSummaryText] = useState("Loading...");
  const [Timestamps, setTimestamps] = useState([{ start: 0, end: 0, summary_text: 'Loading...' }]); 
  const [transcripts, setTranscripts] = useState([{ start: 0, end: 0, text: 'Loading...' }]); 
  const [note, setNote] = useState("Loading...");

  const location = useLocation();
  const url = location.state;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const notes = user.notes;
  const summaries = user.summaries;

  let webSocket = null;
  const handleStart = () => {
    webSocket = new WebSocket("ws://localhost:443/");
    if (webSocket) {
      webSocket.onopen = (event) => {
        console.log("Connected to server");
        webSocket.send("Hello from client");
        webSocket.onmessage = (event) => {
          console.log(event);
        };
      };
    }
  };

  const handleStop = () => {
    if (webSocket) webSocket.close();
    // websocket = null
  };


  const [isOpen, setIsOpen] = useState(false);

  let timeoutId;

  const toggleDropdown = (open) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setIsOpen(open);
    }, 200); // Delay of 200ms
  };

  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
        <motion.div
          className="flex flex-col flex-grow bg-gradient-to-b from-black to-[#6f0000] px-4 md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-between mt-5 ">
            <div className="flex flex-row items-start justify-end gap-3 md:gap-5">
              <button className="bg-white p-2 px-2 border rounded-md cursor-pointer" onClick={handleStart}>Start</button>
              <button className="bg-white p-2 px-2 border rounded-md cursor-pointer" onClick={handleStop}>Stop</button>
              <div className="inline-flex h-10 bg-white text-black font-normal text-[16px] hover:text-red-500 rounded-md cursor-pointer items-center justify-center px-3">
                <LuDownload className="mr-2" /> PDF
              </div>
              <div className="relative">
                <div
                  className="inline-flex h-10 bg-white text-black font-normal text-[16px] hover:text-red-500 rounded-md cursor-pointer items-center justify-center px-3"
                  onMouseEnter={() => toggleDropdown(true)}
                  onMouseLeave={() => toggleDropdown(false)}
                >
                  <FaRegShareFromSquare className="mr-2" /> Share
                </div>
                <div
                  className={`absolute top-10 bg-white shadow-md rounded-md p-2 transition-opacity mt-4 w-full md:w-[150px] lg:w-[200px] ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                  style={{ transition: "opacity 0.3s ease-in-out" }}
                  onMouseEnter={() => toggleDropdown(true)}
                  onMouseLeave={() => toggleDropdown(false)}
                >
                  <a href="#" className="p-2 flex font-medium rounded-lg hover:text-red-900 hover:bg-red-200">Facebook</a>
                  <a href="#" className="p-2 flex font-medium rounded-lg hover:text-red-900 hover:bg-red-200">Reddit</a>
                  <a href="#" className="p-2 flex font-medium rounded-lg hover:text-red-900 hover:bg-red-200">LinkedIn</a>
                  <a href="#" className="p-2 flex rounded-lg py-1 font-medium hover:text-red-900 hover:bg-red-200">Twitter</a>
                </div>
              </div>
              <div className="inline-flex h-10 bg-white text-black font-normal text-[16px] hover:text-red-500 rounded-md cursor-pointer items-center justify-center px-3">
                <FaWandMagicSparkles className="mr-2" /> Summarize
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-5">
            <div className="w-full h-full max-h-[400px] bg-white rounded-lg overflow-y-scroll px-5 ">
              <div className="h-[50px] w-full flex flex-row items-center justify-between text-red-800 font-bold text-3xl">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0 }}
                >
                  NOTES
                </motion.div>
                <div className="flex flex-row gap-4">
                  <FontAwesomeIcon icon={faSave} className="cursor-pointer" onClick={() => handleSaveNote()} />
                  <FontAwesomeIcon icon={faStar} className="cursor-pointer" onClick={() => addNoteToFav()} />
                </div>
              </div>
              <textarea
                id="note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder=""
                className="w-full h-[250px] outline-none overflow-auto text-black text-[18px] font-normal rounded-xl"
              />
            </div>
            <div className="w-full h-full max-h-[400px] bg-white rounded-lg overflow-y-scroll px-5">
              <div className="h-[50px] w-full flex flex-row items-center justify-between text-red-800 font-bold text-3xl">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0 }}
                >
                  TRANSCRIPT
                </motion.div>
                <div className="flex flex-row gap-4">
                  <FontAwesomeIcon icon={faSave} className="cursor-pointer" />
                  <FontAwesomeIcon icon={faStar} className="cursor-pointer" />
                </div>
              </div>
              <div data-testid="transcript-test" className="w-full flex flex-col gap-5 pb-5">
                {transcripts.map((transcript, index) => (
                  <div className="flex" key={index}>
                    <div className="text-[rgb(116,173,252)] w-10 mr-2">{transcript.start}</div>
                    <div className="px-2">{transcript.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-full max-h-[400px] bg-white rounded-lg overflow-y-scroll mb-5 px-5">
              <div className="h-[50px] w-full flex flex-row items-center justify-between text-red-800 font-bold text-3xl">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0 }}
                >
                  SUMMARY
                </motion.div>
                <div className="flex flex-row gap-4">
                  <FontAwesomeIcon icon={faSave} className="cursor-pointer" />
                  <FontAwesomeIcon icon={faStar} className="cursor-pointer" />
                </div>
              </div>
              <div className="w-full h-[250px] overflow-auto text-black text-[18px] font-normal rounded-xl">{summaryText}</div>
            </div>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
      <div><MyChatBot summary={summaryText} /></div>
      <Footer />
    </>
  );
};

export default SummaryPage;
