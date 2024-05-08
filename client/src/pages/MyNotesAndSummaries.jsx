import React, { useEffect, useState } from "react";
import NoteAndSummary from "../components/shared/Card/NoteAndSummaryCard";
import { useDispatch, useSelector } from "react-redux";
import { setUserSlice } from "../redux/userSlice";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  getUser,
  fetchAllSummaries,
  fetchOneSummary,
  getAllNotes,
  getNote,
} from "../https/index";

const MyNotesAndSummaries = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.user);
  const [summaries, setSummaries] = useState([]);
  const notes = user.notes;
  console.log("notes: ", notes);
  // const summaries = user.summaries;
  console.log("summaries: ", summaries);

  const getVideoUrl = (videoId) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const fetchUser = async () => {
    try {
      console.log(user.id);
      console.log({
        id: user.id,
      });
      const response = await getUser({ id: user.id });
      console.log(response);
      dispatch(setUserSlice({ user: response.data.user }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSummaries = async () => {
    try {
      const summariesData = await Promise.all(
        user.notes.map(async (note) => {
          try {
            // Construct the URL with query parameters
            const apiUrl = `${process.env.REACT_APP_API_URL}/summaries/getOne?userId=${user.id}&videoId=${getVideoUrl(note.videoId)}`;

            // Await the axios.get call
            const res = await axios.get(apiUrl);

            // Return the summary body
            return res.data[0].summary.body;
          } catch (err) {
            toast.error("Error while fetching summary", toastOptions);
            console.log(err);
            return null;
          }
        })
      );
      console.log("kk: ", summaries);
      setSummaries(summariesData);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    }
  };

  const handleRedirect = () => {
    navigate("/contact");
  };

  const handleProfileRedirect = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUser();
        await fetchSummaries();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call fetchData function when component mounts
  }, []); // Empty dependency array ensures effect runs only once when component mounts

  return (
    <div className="h-screen">
      <section className="flex flex-col gap-6 bg-gradient-to-b from-[#100b08] to-[#6f0000] h-full w-full overflow-auto pb-4">
        <div className="flex flex-row items-center justify-between mt-7">
          {/* Heading on the left */}
          <h1 className="text-3xl font-bold text-white ml-[80px]">
            My Notes And Summaries
          </h1>

          {/* Icons on the right */}
          <div className="flex flex-row items-center gap-4 mr-14">
            <div className="w-30 h-10 rounded-3xl bg-white flex items-center px-4 hover:bg-gray-200">
              <div className="flex flex-row gap-2" onClick={handleRedirect}>
                <FiPhoneCall className="mt-1" />
                <p className="cursor-pointer">Contact us</p>
              </div>
            </div>

            {/* <div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full">
              <IoMdSettings />
            </div>

            <div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full">
              <IoIosNotifications />
            </div> */}

            <div
              className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full cursor-pointer"
              onClick={handleProfileRedirect}
            >
              <CgProfile />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 h-full pb-8">
          {user.notes.map((note, index) => (
            <NoteAndSummary
              key={index}
              title={`Note Title ${index + 1}`}
              youtubeUrl={`https://www.youtube.com/watch?v=${note.videoId}`}
              note={note.body} // Assuming note content is stored in the 'content' field
              summary={summaries[index]} // Assuming summaries are in the same order as notes
            />
          ))}
          {/* Add more NoteAndSummary components for each note or summary */}
        </div>
      </section>
    </div>
  );
};

export default MyNotesAndSummaries;
