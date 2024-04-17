// SummaryPage.js
import React, { useEffect, useState } from "react";

import axios from "axios";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Analytics = () => {
    const location = useLocation();
    const url = location.state;

    var [wordcloudData, setWordCloudData] = useState([]);
    var [sentimentData, setsentimentData] = useState({});
    var [engagementData, setEngagementData] = useState({});

    //Modify the below useeffect to get the data

    useEffect(() => {
        // Fetch word cloud data
        // axios.get('/wordcloud')
        //     .then(response => {
        //         setWordCloudData(response.data);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching word cloud data:', error);
        //     });

        // // Fetch engagement data
        // axios.get('/engagement')
        //     .then(response => {
        //         setEngagementData(response.data);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching engagement data:', error);
        //     });

        // axios.get('/sentiment')
        //     .then(response => {
        //         setsentimentData(response.data);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching engagement data:', error);
        //     });
    }, []);

    // Dummy data, replace with actual fetch calls
    wordcloudData = null; // Replace with actual data
    sentimentData = { positive: 70, negative: 20, neutral: 10 }; // Replace with actual data
    engagementData = { views: 1000, likes: 500, dislikes: 50, comments: 200, shares: 150 }; // Replace with actual data

    const navigate = useNavigate();


    const [selectedButton, setSelectedButton] = useState("Sentiment Analysis");
    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };

    const renderContent = () => {
        switch (selectedButton) {
            case "Sentiment Analysis":
                return (
                    <div className="bg-slate-50 h-[340px] w-[800px] flex flex-col mt-[50px] rounded-2xl">

                        <div className="flex flex-col mt-8 p-4">
                            {sentimentData ? (
                                <>
                                    <div className="flex items-center h-20">
                                        <label className="mr-4 font-bold">Positive:</label>
                                        <input type="range" min="0" max="100" value={sentimentData.positive} className="w-full mr-2" disabled />
                                        <span className="mr-4 font-bold">{sentimentData.positive}%</span>
                                    </div>
                                    <div className="flex items-center h-20">
                                        <label className="mr-4 font-bold">Negative:</label>
                                        <input type="range" min="0" max="100" value={sentimentData.negative} className="w-full mr-2" disabled />
                                        <span className="mr-4 font-bold">{sentimentData.negative}%</span>
                                    </div>
                                    <div className="flex items-center h-20">
                                        <label className="mr-4 font-bold">Neutral:</label>
                                        <input type="range" min="0" max="100" value={sentimentData.neutral} className="w-full mr-2" disabled />
                                        <span className="mr-4 font-bold">{sentimentData.neutral}%</span>
                                    </div>
                                </>
                            ) : (
                                <div>No Sentiment data available</div>
                            )}
                        </div>
                    </div>
                );
            case "Wordcloud":
                return (
                    <div className="bg-slate-50 h-[340px] w-[800px] flex flex-col mt-[50px] rounded-2xl p-6">
                        <motion.p
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className="text-[55px] maintext flex items-center justify-center mt-8"
                        >
                            Wordcloud Content
                        </motion.p>
                        <div className="flex flex-row gap-4">
                            {wordcloudData ? (
                                <textarea
                                    className="w-full h-48 p-2 bg-white rounded-lg resize-none"
                                    value={wordcloudData}
                                    readOnly
                                />
                            ) : (
                                <div>No Wordcloud data available</div>
                            )}
                        </div>
                    </div>
                );
            case "Engagement Metrics":
                return (
                    <div className="bg-slate-50 h-[310px] w-[800px] flex flex-col mt-[50px] rounded-2xl p-6">
                        <div className="flex flex-col gap-4">
                            {engagementData ? (
                                <div className="text-lg">
                                    <div className="mb-4">
                                        <span className="font-bold">Views:</span> {engagementData.views}
                                    </div>
                                    <div className="mb-4">
                                        <span className="font-bold">Likes:</span> {engagementData.likes}
                                    </div>
                                    <div className="mb-4">
                                        <span className="font-bold">Dislikes:</span> {engagementData.dislikes}
                                    </div>
                                    <div className="mb-4">
                                        <span className="font-bold">Comments:</span> {engagementData.comments}
                                    </div>
                                    <div>
                                        <span className="font-bold">Shares:</span> {engagementData.shares}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-lg">No Engagement data available</div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const handleRedirect = () => {
        navigate("/contact");
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    return (
        <>
            <section className="flex flex-row gap-6  bg-gradient-to-b from-black to-[#6f0000] h-screen">
                <Sidebar />
                <div className="w-full flex flex-col">
                    {/* Top Icons */}
                    <div>
                        <div className="flex groupside justify-end p-2 gap-4 mt-5 mr-4">
                            <div className="w-30 h-10  sidebuttons rounded-3xl flex items-center px-4">
                                <div className="flex flex-row gap-2" onClick={handleRedirect}>
                                    <FiPhoneCall className="mt-1" />
                                    <p className="cursor-pointer">Contact Us</p>
                                </div>
                            </div>

                            <div className="w-10 h-[40px] sidebuttons flex items-center text-[30px] justify-center rounded-full">
                                <IoMdSettings />
                            </div>

                            <div className="w-10 h-[40px] sidebuttons flex items-center text-[30px] justify-center rounded-full">
                                <IoIosNotifications />
                            </div>

                            <div
                                className="w-10 h-[40px] sidebuttons flex items-center text-[30px] justify-center rounded-full  cursor-pointer"
                                onClick={handleProfileRedirect}
                            >
                                <CgProfile />
                            </div>
                        </div>
                    </div>
                    {/* Generate Summary Content */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-slate-50 navtabs h-[50px] w-[600px] mt-[100px] flex flex-row justify-evenly rounded-2xl">
                            <AnimatePresence>
                                <button
                                    className={`relative transition duration-200 ease-in-out text-sm text-black font-medium w-1/3 rounded-2xl`}
                                    onClick={() => handleButtonClick("Sentiment Analysis")}
                                >
                                    <span className="z-10 relative">Sentiment Analysis</span>

                                    {selectedButton === "Sentiment Analysis" ? (
                                        <motion.div
                                            transition={{ type: "spring", stiffness: 50 }}
                                            layoutId="underline"
                                            className="absolute rounded-2xl w-full h-full left-0 bottom-0 bg-red-500 border border-slate-50"
                                        ></motion.div>
                                    ) : null}
                                </button>
                                <button
                                    className={`relative transition duration-200 ease-in-out text-sm text-black font-medium w-1/3 rounded-2xl`}
                                    onClick={() => handleButtonClick("Wordcloud")}
                                >
                                    <span className="z-10 relative">Wordcloud</span>
                                    {selectedButton === "Wordcloud" ? (
                                        <motion.div
                                            transition={{ type: "spring", stiffness: 50 }}
                                            layoutId="underline"
                                            className="absolute rounded-2xl w-full h-full left-0 bottom-0 bg-red-500 border border-slate-50"
                                        ></motion.div>
                                    ) : null}
                                </button>
                                <button
                                    className={`relative transition duration-200  ease-in-out text-sm text-black font-medium w-1/3 rounded-2xl`}
                                    onClick={() => handleButtonClick("Engagement Metrics")}
                                >
                                    <span className="z-10 relative">Engagement Metrics</span>

                                    {selectedButton === "Engagement Metrics" ? (
                                        <motion.div
                                            transition={{ type: "spring", stiffness: 50 }}
                                            layoutId="underline"
                                            className="absolute rounded-2xl w-full h-full left-0 bottom-0 bg-red-500 border border-slate-50"
                                        ></motion.div>
                                    ) : null}
                                </button>
                            </AnimatePresence>
                        </div>
                        {renderContent()}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Analytics;