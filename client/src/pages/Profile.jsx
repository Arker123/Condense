import React, { useState, useEffect } from 'react';
import {
    fetchOneSummary,
    fetchFavSummaries,
    fetchAllSummaries,
    getAllNotes,
    getNote
} from "../https/index"
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from '../components/shared/Card/ProfileCard';
import axios from "axios";
import Sidebar from '../components/shared/Sidebar';
import Footer from "../components/shared/Footer";
const Profile = () => {
    const [activeTab, setActiveTab] = useState('Saved Summaries');
    const user = useSelector((state) => state.user);
    const [summaries, setSummaries] = useState([]);
    const [favSummaries, setFavSummaries] = useState([]);
    const [notes, setNotes] = useState([]);
    const [favNotes, setFavNotes] = useState([]);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleGetAllSummaries = async () => {
        console.log("in handlegetallsummaries");
        console.log(user.id);
        const data = {
            "userId": user.id,
        }
        try {
            console.log("data", data);
            const response = await axios.get("http://localhost:5000/summaries/getAll", {
                data
            });
            setSummaries(response); // Assuming response contains an array of summaries
            console.log(response);
            toast.success("Successfully retrieved all summaries", toastOptions)
            alert("Successfully retrieved all summaries");
            console.log(data);
        } catch (err) {
            alert(`Failed to get all summaries: ${err}`);
            toast.error("Failed to get all summaries", toastOptions)
        }
    };

    useEffect(() => {
        handleGetAllSummaries();
        // handleGetfavSummaries();
        // handleGetAllNotes();
    }, []); // Fetch summaries when the component mounts

    const handleGetfavSummaries = async () => {
        console.log("in handlegetfavsummaries");
        const data = {
            userId: user.id,
        }
        try {
            const response = await fetchFavSummaries(data);
            setFavSummaries(response); // Assuming response contains an array of summaries
            console.log(response);
            toast.success("Successfully retrieved all fav summaries", toastOptions)
            alert("Successfully retrieved all fav summaries");
            console.log(data);
        } catch (err) {
            alert(`Failed to get all fav summaries: ${err}`);
            toast.error("Failed to get all fav summaries", toastOptions)
        }
    };

    const handleGetAllNotes = async () => {
        console.log("in handlegetallNotes");
        const data = {
            userId: user.id,
        }
        try {
            const response = await getAllNotes(data);
            setNotes(response);
            console.log(response);
            toast.success("Successfully retrieved all notes", toastOptions)
            alert("Successfully retrieved all notes");
            console.log(data);
        } catch (err) {
            alert(`Failed to get all notes: ${err}`);
            toast.error("Failed to get all notes", toastOptions)
        }
    };

  return (
    <>
    <section className="flex flex-col gap-6 bg-gradient-to-b from-black  to-[#6f0000] h-screen p-8">
        <Sidebar />
        {/* Profile Info */}
        <div className="flex flex-col gap-2 text-white border border-white p-4 rounded-md shadow-lg h-1/4">
            <h2 className="text-4xl font-bold mb-2">Profile</h2>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">Email:</span>
                <span className="text-lg font-semibold">example@example.com</span>
            </div>
            <button className="bg-white text-black px-4 py-2 w-[200px] mt-2 rounded-md hover:bg-gray-300 hover:text-gray-800 transition-colors duration-300 ease-in-out">
                Update Password
            </button>
        </div>

        <div className="flex flex-col text-white border border-white p-4 rounded-md h-3/4">
            {/* Tabs */}
            <div className="flex flex-row gap-4 text-white border border-white p-1 rounded-md h-[60px]">
                <div className={`flex-grow cursor-pointer p-2 ${activeTab === 'Saved Summaries' ? 'bg-white rounded-md shadow-lg text-red-800' : ''}`} onClick={() => handleTabClick('Saved Summaries')}>
                    <h3 className="text-lg font-semibold text-center">Saved Summaries</h3>
                </div>
                <div className={`flex-grow cursor-pointer p-2 ${activeTab === 'Saved Notes' ? 'bg-white rounded-md shadow-lg text-red-800' : ''}`} onClick={() => handleTabClick('Saved Notes')}>
                    <h3 className="text-lg font-semibold text-center">Saved Notes</h3>
                </div>
                <div className={`flex-grow cursor-pointer p-2 ${activeTab === 'Favorite Summaries' ? 'bg-white rounded-md shadow-lg text-red-800' : ''}`} onClick={() => handleTabClick('Favorite Summaries')}>
                    <h3 className="text-lg font-semibold text-center">Favorite Summaries</h3>
                </div>
                <div className={`flex-grow cursor-pointer p-2 ${activeTab === 'Favorite Notes' ? 'bg-white rounded-md shadow-lg text-red-800' : ''}`} onClick={() => handleTabClick('Favorite Notes')}>
                    <h3 className="text-lg font-semibold text-center">Favorite Notes</h3>
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow text-white p-1 mt-1">
                {activeTab === 'Saved Summaries' && (
                    <div className='bg bg-slate-100 text-red-900 rounded-md shadow-md p-2 h-full text-1xl'>
                        {/* Content for Saved Summaries tab */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {summaries.map(summary => (
                                <ProfileCard key={summary._id} summary={summary} />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'Saved Notes' && (
                    <div className='bg bg-slate-100 text-red-900 rounded-md shadow-md p-2 h-full text-1xl'>
                        {/* Content for Saved Notes tab */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {notes.map(note => (
                                <ProfileCard key={note._id} summary={note} />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'Favorite Summaries' && (
                    <div className='bg bg-slate-100 text-red-900 rounded-md shadow-md p-2 h-full text-1xl'>
                        {/* Content for Favorite Summaries tab */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {summaries.map(summary => (
                                <ProfileCard key={summary._id} summary={summary} />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'Favorite Notes' && (
                    <div className='bg bg-slate-100 text-red-900 rounded-md shadow-md p-2 h-full text-1xl'>
                        {/* Content for Favorite Notes tab */}
                    </div>
                )}
            </div>
        </div>
        <ToastContainer />
    </section>
    <Footer/>
    </>
  );
};

export default Profile;
