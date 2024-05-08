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
import jsPDF from "jspdf";

const SummaryPage = () => {
  const [summaryText, setSummaryText] = useState("Loading...");
  const [Timestamps, setTimestamps] = useState([
    { start: 0, end: 0, summary_text: "Loading..." },
  ]);
  const [transcripts, setTranscripts] = useState([
    { start: 0, end: 0, text: "Loading..." },
  ]);
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
      const res = axios.post(
        `${process.env.REACT_APP_API_URL}/summaries/generate`,
        {
          videoId,
        }
      );
      res
        .then((res) => {
          const sum = JSON5.parse(res.data?.summary || "");
          setSummaryText(sum.summary);
          setTimestamps(sum.time_stamp);
        })
        // .then((res) => {
        //   return JSON.parse(res);
        // })
        // .then((summary) => setSummaryText(summary.summary))

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

  const downloadPdf = () => {
    const doc = new jsPDF();

    // Add Summary
    doc.text(10, 10, "Summary:");
    doc.text(10, 20, summaryText);

    // Add Notes
    doc.text(10, 40, "Notes:");
    doc.text(10, 50, note);

    // Add Transcripts
    doc.text(10, 70, "Transcripts:");
    transcripts.forEach((transcript, index) => {
      doc.text(10, 80 + index * 10, `${transcript.start}: ${transcript.text}`);
    });

    doc.save("summary.pdf");
  };

  const sharePdf = (option) => {
    const doc = new jsPDF();

    // Add Summary
    doc.text(10, 10, "Summary:");
    doc.text(10, 20, summaryText);

    // Add Notes
    doc.text(10, 40, "Notes:");
    doc.text(10, 50, note);

    // Add Transcripts
    doc.text(10, 70, "Transcripts:");
    transcripts.forEach((transcript, index) => {
      doc.text(10, 80 + index * 10, `${transcript.start}: ${transcript.text}`);
    });

    // Generate Blob from PDF content
    const pdfBlob = doc.output("blob");

    // Generate URL for Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Share PDF via URL
    if (option === "whatsapp") {
      const message = "Check out this PDF";
      const shareLink = `https://wa.me/?text=${encodeURIComponent(message)}%0A${encodeURIComponent(pdfUrl)}`;
      window.open(shareLink, "_blank");
    } else if (option === "linkedin") {
      const title = "Check out this PDF";
      const summary = "This is a summary of the PDF content";
      const source = "Condense";
      const shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pdfUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}&source=${encodeURIComponent(source)}`;
      window.open(shareLink, "_blank");
    } else if (option === "telegram") {
      const shareLink = `https://t.me/share/url?url=${encodeURIComponent(pdfUrl)}`;
      window.open(shareLink, "_blank");
    } else if (option === "facebook") {
      const shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pdfUrl)}`;
      window.open(shareLink, "_blank");
    } else if (option === "twitter") {
      const text = "Check out this PDF";
      const shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pdfUrl)}&text=${encodeURIComponent(text)}`;
      window.open(shareLink, "_blank");
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
          <div className="flex justify-between mt-5 ">
            <div className="flex flex-row w-full h-full max-w-[500px] rounded-lg hover:shadow-xl">
              <iframe
                className="w-full h-full rounded-lg"
                src={handleVideoUrl(url)}
                title="YouTube video player"
                autoPlay
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
            <div className="flex flex-row items-start justify-end gap-3 md:gap-5">
              <div
                className="inline-flex h-10 bg-white text-black font-normal text-[16px] hover:text-red-500 rounded-md cursor-pointer items-center justify-center px-3"
                onClick={downloadPdf}
              >
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
                  <a
                    href="#"
                    className="p-2 flex font-medium rounded-lg hover:text-red-900 hover:bg-red-200"
                    onClick={() => sharePdf("facebook")}
                  >
                    <FontAwesomeIcon
                      icon={["fab", "facebook"]}
                      className="mr-2"
                    />{" "}
                    Facebook
                  </a>
                  <a
                    href="#"
                    className="p-2 flex font-medium rounded-lg hover:text-red-900 hover:bg-red-200"
                    onClick={() => sharePdf("whatsapp")}
                  >
                    <FontAwesomeIcon
                      icon={["fab", "whatsapp"]}
                      className="mr-2"
                    />{" "}
                    WhatsApp
                  </a>
                  <a
                    href="#"
                    className="p-2 flex font-medium rounded-lg hover:text-red-900 hover:bg-red-200"
                    onClick={() => sharePdf("linkedin")}
                  >
                    <FontAwesomeIcon
                      icon={["fab", "linkedin"]}
                      className="mr-2"
                    />{" "}
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    className="p-2 flex rounded-lg py-1 font-medium hover:text-red-900 hover:bg-red-200"
                    onClick={() => sharePdf("twitter")}
                  >
                    <FontAwesomeIcon
                      icon={["fab", "twitter"]}
                      className="mr-2"
                    />{" "}
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="p-2 flex rounded-lg py-1 font-medium hover:text-red-900 hover:bg-red-200"
                    onClick={() => sharePdf("telegram")}
                  >
                    <FontAwesomeIcon
                      icon={["fab", "telegram"]}
                      className="mr-2"
                    />{" "}
                    Telegram
                  </a>
                </div>
              </div>
              <div className="inline-flex h-10 bg-white text-black font-normal text-[16px] hover:text-red-500 rounded-md cursor-pointer items-center justify-center px-3">
                <FaWandMagicSparkles className="mr-2" /> Summarize
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-5">
            <div className="w-full h-full max-h-[400px] bg-white rounded-lg overflow-y-auto px-5 ">
              <div className="h-[50px] w-full flex flex-row items-center justify-between text-red-800 font-bold text-3xl">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0 }}
                >
                  NOTES
                </motion.div>
                <div className="flex flex-row gap-4">
                  <FontAwesomeIcon
                    icon={faSave}
                    className="cursor-pointer"
                    onClick={() => handleSaveNote()}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    className="cursor-pointer"
                    onClick={() => addNoteToFav()}
                  />
                </div>
              </div>
              <textarea
                data-testid="notes-test"
                id="note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder=""
                className="w-full h-[250px] outline-none overflow-auto text-black text-[18px] font-normal rounded-xl"
              />
            </div>
            <div className="w-full h-full max-h-[400px] bg-white rounded-lg overflow-y-auto px-5">
              <div className="h-[50px] w-full flex flex-row items-center justify-between text-red-800 font-bold text-3xl">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0 }}
                >
                  TIMESTAMPS
                </motion.div>

                <div className="flex flex-row gap-4">
                  <FontAwesomeIcon icon={faSave} className="cursor-pointer" />
                  <FontAwesomeIcon icon={faStar} className="cursor-pointer" />
                </div>
              </div>
              <div
                data-testid="timestamps-test"
                className="w-full flex flex-col gap-5 pb-5"
              >
                {Timestamps.map((timestamp, index) => (
                  <div className="flex" key={index}>
                    <div className="text-[rgb(116,173,252)] w-10 mr-2">
                      {parseInt(timestamp.start)}
                    </div>
                    <div className="px-2">{timestamp.summary_text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-full max-h-[400px] bg-white rounded-lg  px-5">
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
              <div
                data-testid="transcript-test"
                className="w-full flex flex-col gap-5 pb-5"
              >
                {transcripts.map((transcript, index) => (
                  <div className="flex" key={index}>
                    <div className="text-[rgb(116,173,252)] w-10 mr-2">{convertTime(transcript.start)}</div>
                    <div className="px-2">{transcript.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-full max-h-[400px] bg-white rounded-lg overflow-y-auto mb-5 px-5">
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
              <div className="w-full h-[250px] overflow-auto text-black text-[18px] font-normal rounded-xl">
                {summaryText}
              </div>
              <div data-testid="summary-test" className="w-full h-[250px] overflow-auto text-black text-[18px] font-normal rounded-xl">{summaryText}</div>
            </div>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
      <div>
        <MyChatBot summary={summaryText} />
      </div>
      <Footer />
    </>
  );
};

export default SummaryPage;
