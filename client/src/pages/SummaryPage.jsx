import React, { useEffect, useState } from "react";
import styles from "./SummaryPage.module.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faStar } from '@fortawesome/free-solid-svg-icons';
import { 
  getNote, 
  modifyNote, 
  createNote, 
  deleteNote, 
  modifyFavSummaries,  
  fetchOneSummary, 
  saveSummary 
} from "../https/index";
import { useSelector } from "react-redux";

const SummaryPage = () => {
  // const [url, setUrl] = useState("");
  const location = useLocation();
  const url = location.state;
  const [note, setNote] = useState("");
  console.log(`in url page, url: ${url}`)
  const user = useSelector((state)=>state.user);
  const notes = useSelector((state)=>state.data.notes);

  const [summaryText, setSummaryText] = useState("");

  const fetchSummary = async () => {
    const res = await axios.post("http://localhost:5000/summary/generate", {
      url,
    });
    setSummaryText(res.data);
  };

  const handleSaveSummary = async() => {
    const data = {
      userId: user.id,
      videoId: url,
      summaryBody:  summaryText
    };

    const response = await saveSummary(data);
    console.log(response);
  };

  const addSummaryToFav = () => {

  };

  const handleSaveNote = async() => {
    const data = {
      note: {body: note, videoId: url},
      userId: user.id,
      videoId: url
    };

    const filteredArray = notes.filter(item => item[videoId] === url);

    if(filteredArray.length > 0){
      const response = await createNote(data);
    }
    else{
      const response = await modifyNote(data);
    }
  };

  const handleDeleteNote = async() => {
    const data = {
      userId: user.id,
      videoId: url
    }

    const response = await deleteNote(data);
    console.log(response);
  };

  const addNoteToFav = () => {
    
  }

  useEffect(() => {}, [url]);

  return (
    <div className="">
      <motion.div
        className=" flex flex-col justify-center items-center bg-gradient-to-b from-red-500 via-red-900 to-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full h-[1400px] bg-gradient-to-b from-red-500 via-red-900 to-black mb-4">
          <div className="flex flex-col w-full h-[1200px] bg-none p-12">
            <div className="flex flex-row w-full bg-none">
              <div className="w-3/5 h-[600px] bg-white rounded-lg mr-4">
                <div className='p-4 items-center justify-center bg-none'>
                  <div className="relative" style={{ paddingTop: "56.25%" }}>
                    <iframe
                      // width="680"
                      // height="450"
                      className="absolute top-0 left-0 w-full h-full"
                      src={url}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
              <div className="w-2/5 bg-white rounded-lg ml-4 pl-4 pr-4" style={{ height: '600px' }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={styles.transcriptHeader}>NOTES</h2>
                  <div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700">
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                  </div>
                </div>
                <textarea
                  id="note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder=""
                  className="bg-none w-full h-[480px] outline-none overflow-auto"
                  // style={{ paddingTop: '20px' }}
                />
              </div>
                
            </div>
            <div className="flex flex-row w-full bg-none h-[800px] mt-12">
              <div className="w-1/2  bg-white rounded-lg mr-4 pl-4 pr-4" style={{ height: '600px' }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={styles.transcriptHeader}>TRANSCRIPT</h2>
                  
                </div>
                <div>

                </div>
              </div>
              <div className="w-1/2 bg-white rounded-lg ml-4 pl-4 pr-4" style={{ height: '600px' }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={styles.transcriptHeader}>SUMMARY</h2>
                  <div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700">
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                  </div>
                </div>
                <div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default SummaryPage;