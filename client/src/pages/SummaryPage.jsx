// SummaryPage.js
import React, { useEffect, useState } from "react";
import styles from "./SummaryPage.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faStar } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
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

const SummaryPage = () => {
  const [summaryText, setSummaryText] = useState("Loading...");
  const [transcripts, setTranscripts] = useState([]);
  const [note, setNote] = useState("Loading...");

  const location = useLocation();
  const url = location.state;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const notes = user.notes;
  const summaries = user.summaries;
  console.log("summaa:  ", summaries);

  const convertTime = (time) => {
    let seconds = Math.floor(time);
    // const minutes = "0" + Math.floor(seconds / 60) ;
    let minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    seconds = seconds % 60;
    seconds = seconds.toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const fetchUser = async () => {
    try {
      console.log("user id: ", user.id);
      console.log({
        id: user.id,
      });
      const response = await getUser({ id: user.id });
      console.log("in fetch user: ", response);
      dispatch(setUserSlice({ user: response.data.user }));
      const notes = response.data.user.notes;
      setNote(notes.find((item) => item.videoId === videoId)?.body || "");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (url) {
      const fetchData = async () => {
        await fetchUser();
        await fetchTranscript();
        await fetchSummary();
      };
      fetchData();
    } else {
      const timeout = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [url]);
  if (!url) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div>Invalid URL</div>
        <div>Redirecting...</div>
      </div>
    );
  }
  console.log(`in url page, url: ${url}`);

  const getVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(url);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const fetchSummary = () => {
    const reqSummary = summaries.find((summary) => summary.videoId == url);
    console.log("req summ:  ", reqSummary);

    if (!reqSummary) {
      console.log("hii: ");
      const res = axios.post(
        `${process.env.REACT_APP_API_URL}/summaries/generate`,
        {
          videoId,
        }
      );
      res
        .then((res) => {
          const sum = JSON5.parse(res.data?.summary || "")
          setSummaryText(sum.summary);
        })
        .catch((err) => {
          toast.error("Error while fetching summary", toastOptions);

          console.log(err);
        });
    } else {
      console.log("in fetch one summary");
      const userId = user.id;
      console.log(userId);
      console.log(url);

      // Construct the URL with query parameters
      const apiUrl = `${process.env.REACT_APP_API_URL}/summaries/getOne?userId=${userId}&videoId=${url}`;

      const res = axios.get(apiUrl);
      res
        .then((res) => {
          setSummaryText(res.data[0]?.summary?.body);
        })
        .catch((err) => {
          toast.error("Error while fetching summary", toastOptions);

          console.log(err);
        });
    }
  };
  const fetchTranscript = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/transcript/`,
        {
          url,
        }
      );
      const transcripts = await JSON5.parse(res.data.transcript);
      console.log(transcripts);
      setTranscripts(transcripts);
    } catch (error) {
      toast.error("Error while fetching transcripts", toastOptions);
    }
  };

  const handleSaveSummary = async () => {
    console.log("in handlesavesummary");
    const data = {
      userId: user.id,
      videoId: url,
      summaryBody: summaryText,
    };

    try {
      const response = await saveSummary(data);
      console.log(response);
      toast.success("Summary saved successfully");
    } catch (error) {
      // console.log(error);
      let errorMessage = "Error while saving";
      toast.error(errorMessage, toastOptions);
    }
  };

  const addSummaryToFav = async () => {
    console.log("in addsummarytofav");
    const data = {
      userId: user.id,
      videoId: url,
    };

    try {
      const response = await modifyFavSummaries(data);
      console.log(response);
      toast.success("Summary fav flipped successfully");
    } catch (error) {
      console.log(error);
      let errorMessage = "Error while updating fv";
      toast.error(errorMessage, toastOptions);
    }
  };

  const handleSaveNote = async () => {
    const data = {
      userId: user.id,
      videoId: videoId,
      note: { title: "Untitled Note", body: note },
    };

    const reqNote = notes.find((item) => item.videoId === videoId);

    if (!reqNote) {
      try {
        const response = await createNote(data);
        console.log(response);
        toast.success("Note saved successfully");
        window.location.reload();
      } catch (error) {
        console.log(error);
        let errorMessage = "Error while saving";
        toast.error(errorMessage, toastOptions);
      }
    } else {
      try {
        const response = await modifyNote(data);
        console.log(response);
        toast.success("Note saved successfully");
        window.location.reload();
      } catch (error) {
        console.log(error);
        let errorMessage = "Error while saving";
        toast.error(errorMessage, toastOptions);
      }
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

  const addNoteToFav = async () => {
    console.log(" in fav note");
    const data = {
      userId: user.id,
      videoId: videoId,
    };

    try {
      const res = await modifyFavNotes(data);
      toast.success("Summary fav flipped successfully");
    } catch (error) {
      console.log(error);
      let errorMessage = "Error while updating fv";
      toast.error(errorMessage, toastOptions);
    }
  };

  const handleVideoUrl = (url) => {
    const videoId = getVideoId(url);
    const videoUrl = "https://www.youtube.com/embed/" + videoId;
    return videoUrl;
  };

  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
        <motion.div
          className=" flex flex-col justify-center items-center bg-gradient-to-b from-black  to-[#6f0000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="w-full h-[1400px] bg-gradient-to-b from-black  to-[#6f0000] mb-4">
            <div className="flex flex-col w-full h-[1200px] bg-none p-12">
              <div className="flex flex-row w-full bg-none">
                <div className="w-3/5 h-[600px] bg-white rounded-lg mr-4">
                  <div className="p-4 items-center justify-center bg-none">
                    <div className="relative" style={{ paddingTop: "56.25%" }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={handleVideoUrl(url)}
                        title="YouTube video player"
                        frameBorder="0"
                        autoPlay
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
                <div
                  className="w-2/5 bg-white rounded-lg ml-4 pl-4 pr-4"
                  style={{ height: "600px" }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={styles.transcriptHeader}>NOTES</h2>
                    <div>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700"
                        onClick={() => handleSaveNote()}
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => addNoteToFav()}
                      >
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
                    data-testid="notes-test"
                    className="bg-none w-full h-[480px] outline-none overflow-auto"
                  />
                </div>
              </div>
              <div className="flex flex-row w-full bg-none h-[800px] mt-12">
                <div
                  className="w-1/2  bg-white rounded-lg mr-4 pl-4 pr-4 overflow-y-scroll"
                  style={{ height: "600px" }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={styles.transcriptHeader}>TRANSCRIPT</h2>
                  </div>
                  <div
                    data-testid="transcript-test"
                    className="w-full flex flex-col gap-5 pb-5"
                  >
                    {transcripts.length === 0
                      ? "Loading..."
                      : transcripts.map((transcript) => (
                          <div className="flex">
                            <div className="text-[rgb(116,173,252)] w-10 mr-2">
                              {convertTime(transcript.start)}
                            </div>
                            <div className="px-2 w-full">{transcript.text}</div>
                          </div>
                        ))}
                  </div>
                </div>
                <div
                  className="w-1/2 bg-white rounded-lg ml-4 pl-4 pr-4 overflow-y-scroll"
                  style={{ height: "600px" }}
                >
                  <div className="flex justify-between items-center mb-4 ">
                    <h2 className={styles.transcriptHeader}>SUMMARY</h2>
                    <div>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700"
                        onClick={() => handleSaveSummary()}
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => addSummaryToFav()}
                      >
                        <FontAwesomeIcon icon={faStar} />
                      </button>
                    </div>
                  </div>
                  <div data-testid="summary-test">{summaryText}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default SummaryPage;
