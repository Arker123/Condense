import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faStar } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import { modifyNote, createNote, deleteNote, modifyFavSummaries, saveSummary, getUser, modifyFavNotes } from "../https/index";
import { useDispatch, useSelector } from "react-redux";
import JSON5 from "json5";
import { setUserSlice } from "../redux/userSlice";
import MyChatBot from "../components/shared/Chatbot/Chatbot";

const SummaryPage = () => {
  const [summaryText, setSummaryText] = useState("Loading...");
  const [note, setNote] = useState("Loading...");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const notes = user.notes;
  const summaries = user.summaries;

  const fetchUser = async () => {
    try {
      const response = await getUser({ id: user.id });
      dispatch(setUserSlice({ user: response.data.user }));
      const notes = response.data.user.notes;
      setNote(notes.find((item) => item.videoId === videoId)?.body || "");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser();
      await fetchSummary();
    };
    fetchData();
  }, []);

  const fetchSummary = () => {
    const reqSummary = summaries.find((summary) => summary.videoId == url);

    if (!reqSummary) {
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
          toast.error("Error while fetching summary");
          console.log(err);
        });
    } else {
      const userId = user.id;
      const apiUrl = `${process.env.REACT_APP_API_URL}/summaries/getOne?userId=${userId}&videoId=${url}`;

      const res = axios.get(apiUrl);
      res
        .then((res) => {
          setSummaryText(res.data[0]?.summary?.body);
        })
        .catch((err) => {
          toast.error("Error while fetching summary");
          console.log(err);
        });
    }
  };

  const handleSaveSummary = async () => {
    const data = {
      userId: user.id,
      videoId: url,
      summaryBody: summaryText,
    };

    try {
      const response = await saveSummary(data);
      toast.success("Summary saved successfully");
    } catch (error) {
      toast.error("Error while saving");
    }
  };

  const addSummaryToFav = async () => {
    const data = {
      userId: user.id
    };

    try {
      const response = await modifyFavSummaries(data);
      toast.success("Summary fav flipped successfully");
    } catch (error) {
      toast.error("Error while updating favorite");
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
        toast.success("Note saved successfully");
        window.location.reload();
      } catch (error) {
        toast.error("Error while saving");
      }
    } else {
      try {
        const response = await modifyNote(data);
        toast.success("Note saved successfully");
        window.location.reload();
      } catch (error) {
        toast.error("Error while saving");
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
    const data = {
      userId: user.id,
      videoId: videoId,
    };

    try {
      const res = await modifyFavNotes(data);
      toast.success("Summary fav flipped successfully");
    } catch (error) {
      toast.error("Error while updating favorite");
    }
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
            <div className="w-full h-full max-h-[400px] bg-white rounded-lg overflow-y-scroll px-5">
              <div className="h-[50px] w-full flex flex-row items-center justify-between text-red-800 font-bold text-3xl">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0 }}
                >
                  SUMMARY
                </motion.div>
                <div className="flex flex-row gap-4">
                  <FontAwesomeIcon icon={faSave} className="cursor-pointer" onClick={() => handleSaveSummary()} />
                  <FontAwesomeIcon icon={faStar} className="cursor-pointer" onClick={() => addSummaryToFav()} />
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
