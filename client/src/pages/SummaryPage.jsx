// SummaryPage.js
import React, { useEffect, useState } from "react";
import styles from "./SummaryPage.module.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faStar } from "@fortawesome/free-solid-svg-icons";
import {
  getNote,
  modifyNote,
  createNote,
  deleteNote,
  modifyFavSummaries,
  fetchOneSummary,
  saveSummary,
} from "../https/index";
import { useSelector } from "react-redux";
import { LuDownload } from "react-icons/lu";
import JSON5 from "json5";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { FaWandMagicSparkles } from "react-icons/fa6";

const SummaryPage = () => {
  // const [url, setUrl] = useState("");
  const location = useLocation();
  const url = location.state;
  const [note, setNote] = useState("");
  console.log(`in url page, url: ${url}`);
  const user = useSelector((state) => state.user);
  const notes = user.notes;
  const summaries = user.summaries;

  const getVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(url);

  const [summaryText, setSummaryText] = useState("");
  const [transcripts, setTranscripts] = useState([]);
  // const [transcripts]

  const fetchSummary = async () => {
    // const summary = summaries.find((item) => item.videoId === videoId);
    const res = await axios.post("http://localhost:5000/summaries/generate", {
      url,
    });
    setSummaryText(res.data.summary);
  };
  const fetchTranscript = async () => {
    const res = await axios.post("http://localhost:5000/transcript/", {
      url,
    });
    
    const transcripts = await JSON5.parse(res.data.transcript);
    console.log(transcripts);
    setTranscripts(transcripts);
  };

  const handleSaveSummary = async () => {
    const data = {
      userId: user.id,
      videoId: url,
      summaryBody: summaryText,
    };

    const response = await saveSummary(data);
    console.log(response);
  };

  const addSummaryToFav = () => {};

  const handleSaveNote = async () => {
    const data = {
      note: { body: note, videoId: url },
      userId: user.id,
      videoId: url,
    };

    const filteredArray = notes.filter((item) => item[videoId] === url);

    if (filteredArray.length > 0) {
      const response = await createNote(data);
    } else {
      const response = await modifyNote(data);
    }
  };

  const handleDeleteNote = async () => {
    const data = {
      userId: user.id,
      videoId: url,
    };

    const response = await deleteNote(data);
    console.log(response);
  };

  const addNoteToFav = () => {};

  const handleVideoUrl = (url) => {
    const videoId = getVideoId(url);
    const videoUrl = "https://www.youtube.com/embed/" + videoId;
    return videoUrl;
  };

  useEffect(() => {
    fetchTranscript();
    fetchSummary();
  }, [url]);

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
    <div className="">
      <motion.div
        className="  bg-gradient-to-b from-red-500 via-red-900 to-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >

        <div className="flex flex-row items-end justify-end gap-[20px] mr-10 ">
          <div className="w-[90px] h-10 bg-white text-black font-normal text-[16px] hover:text-red-500 rounded-md flex flex-row gap-2 cursor-pointer items-center justify-center mt-3"><LuDownload />PDF</div>
          {/* <div className="w-[90px] h-10 bg-white text-black font-normal text-[16px] hover:text-red-500 rounded-md flex flex-row gap-2 cursor-pointer items-center justify-center mt-3"><FaRegShareFromSquare />Share</div> */}
          <div className="relative">
            <div
              className="w-[90px] h-10 bg-white text-black font-normal text-[16px] hover:text-red-500 rounded-md flex flex-row gap-2 cursor-pointer items-center justify-center mt-3"
              onMouseEnter={() => toggleDropdown(true)}
        onMouseLeave={() => toggleDropdown(false)}
            >
              <FaRegShareFromSquare /> Share
            </div>
            <div
              className={`absolute top-10 right-0 bg-white shadow-md rounded-md p-2 transition-opacity w-[150px] mt-4  ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{ transition: "opacity 0.3s ease-in-out" }}
              onMouseEnter={() => toggleDropdown(true)}
              onMouseLeave={() => toggleDropdown(false)}
            >
            
                <a href="#" className=" py-1 flex items-center justify-center font-medium rounded-lg hover:text-red-900 hover:bg-red-200">share to Facebook</a>
                <a href="#" className="py-1 flex items-start justify-center font-medium rounded-lg hover:text-red-900 hover:bg-red-200">share to Reddit</a>
                <a href="#" className="py-1 flex items-center justify-center font-medium rounded-lg hover:text-red-900 hover:bg-red-200">share to Linkedln</a>
                <a href="#" className="flex items-center justify-center rounded-lg py-1 font-medium hover:text-red-900 hover:bg-red-200">share to Twitter</a>
                </div>
          </div>
          <div className="w-[120px] h-10 bg-white text-black font-normal text-[16px] hover:text-red-500 rounded-md flex flex-row gap-2 cursor-pointer items-center justify-center mt-3"><FaWandMagicSparkles />Summarize</div>
        </div>

        <div className="flex flex-row w-full h-screen bg-gradient-to-b from-red-500 via-red-900 to-black mt-5 ">
          

            <div className="flex flex-col w-[700px]  h-screen items-center justify-center gap-4 ">
            


              <div className="w-[600px] h-[320px] rounded-xl flex items-center justify-center hover:shadow-xl">
               
                  
                    <iframe
                      className="w-[600px] h-[320px] rounded-xl"
                      src={handleVideoUrl(url)}
                      title="YouTube video player"
                      frameBorder="0"
                      autoPlay
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                
                
              </div>

              <div
                className="w-[600px]  bg-white rounded-xl  overflow-y-scroll mb-5"
                style={{ height: "600px" }}
              >
                <div className="flex justify-between items-center w-[200px] h-[50px] ml-5 text-[33px] font-bold text-red-800">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0 }}
                >
                  TRANSCRIPT
                </motion.div>
                </div>
                <div className="w-full flex flex-col gap-5 pb-5">
                  {transcripts.map((transcript) => (
                    <div className="flex">
                      <div className="text-[rgb(116,173,252)] w-10 mr-2">{transcript.start}</div>
                      <div className="px-2 w-full">{transcript.text}</div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>

            <div className="flex flex-col w-[900px]  h-screen items-center justify-center gap-6">
            <div
                className="w-[800px] h-[500px] bg-white rounded-lg flex flex-col items-center justify-center overflow-y-scroll"
                
              >
                <div className="h-[50px] w-[730px] flex flex-row  items-center justify-between  text-red-800 font-bold text-[33px] ">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0}}
                >
                  NOTES
                </motion.div>
                  
                  <div className="flex flex-row gap-4">
                   
                      <FontAwesomeIcon icon={faSave} className="cursor-pointer" />
                    
                    
                      <FontAwesomeIcon icon={faStar} className="cursor-pointer" />
                  
                  </div>
                </div>
                <textarea
                  id="note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder=""
                  className="w-[730px] h-[500px] outline-none overflow-auto text-black text-[18px] font-normal rounded-xl"
                  // style={{ paddingTop: '20px' }}
                />
              </div>

              <div
                className="w-[800px] h-[700px] bg-white rounded-lg flex flex-col items-center justify-center overflow-y-scroll mb-5"
                
              >
                <div className="h-[50px] w-[730px] flex flex-row  items-center justify-between  text-red-800 font-bold text-[33px] ">
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
                <div className="w-[730px] h-[500px] outline-none overflow-auto text-black text-[18px] font-normal rounded-xl">{summaryText}</div>
              </div>
            </div>

          
        </div>
      </motion.div>

    
    </div>
  );
};

export default SummaryPage;
