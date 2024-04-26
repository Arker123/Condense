import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { motion } from "framer-motion";

// SentimentAnalysis component to display sentiment analysis data
// SentimentAnalysis component to display sentiment analysis data
const SentimentAnalysis = ({ sentimentData }) => {
    return (
        <div className="bg-slate-50 h-[300px] w-[300px] flex flex-col rounded-2xl items-center justify-center mt-4">
            <p className="text-xl font-bold">Sentiment Analysis</p>
            <p className="text-sm">Positive: {sentimentData.positive}%</p>
            <p className="text-sm">Negative: {sentimentData.negative}%</p>
            <p className="text-sm">Neutral: {sentimentData.neutral}%</p>
        </div>
    );
};

// WordCloud component to display word cloud data
const WordCloud = ({ wordcloudData }) => {
    // Render word cloud data here
    return (
        <div className="bg-slate-50 h-[300px] w-[300px] flex flex-col rounded-2xl items-center justify-center mt-4">
            <p className="text-xl font-bold">Word Cloud</p>
            {/* Render word cloud content here */}
        </div>
    );
};


const Analytics = () => {
    const location = useLocation();
    const url = location.state;

    var [wordcloudData, setWordCloudData] = useState([]);
    var [sentimentData, setsentimentData] = useState({});
    var [engagementData, setEngagementData] = useState({});
    var [youtubeStats, setYoutubeStats] = useState({
        views: 0,
        likes: 0,
        dislikes: 0,
        comments: 0,
        shares: 0,
    });

    useEffect(() => {
        // Fetch YouTube statistics data
        axios.get('/youtube-stats')
            .then(response => {
                setYoutubeStats(response.data);
            })
            .catch(error => {
                console.error('Error fetching YouTube statistics:', error);
            });

        // Fetch sentiment analysis data
        axios.get('/sentiment-analysis')
            .then(response => {
                setsentimentData(response.data);
            })
            .catch(error => {
                console.error('Error fetching sentiment analysis data:', error);
            });

        // Fetch word cloud data
        axios.get('/wordcloud')
            .then(response => {
                setWordCloudData(response.data);
            })
            .catch(error => {
                console.error('Error fetching word cloud data:', error);
            });

        // Fetch engagement data as before
    }, []);

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/contact");
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };

    const [selectedButton, setSelectedButton] = useState("Sentiment Analysis");

    return (
        <>
            <section className="flex flex-row gap-6 bg-gradient-to-b from-black to-[#6f0000] h-screen">
                <Sidebar />
                <div className="w-full flex flex-col">
                    {/* Top Icons */}
                    <div>
                        <div className="flex groupside justify-end p-2 gap-4 mt-5 mr-4">
                            <div className="w-30 h-10 sidebuttons rounded-3xl flex items-center px-4">
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
                            <div className="w-10 h-[40px] sidebuttons flex items-center text-[30px] justify-center rounded-full cursor-pointer" onClick={handleProfileRedirect}>
                                <CgProfile />
                            </div>
                        </div>
                    </div>
                    {/* YouTube Statistics Boxes */}
                    <div className="flex justify-between p-4">
                        <div className="bg-slate-50 h-[100px] w-[200px] flex flex-col rounded-2xl items-center justify-center mt-16">
                            <p className="text-xl font-bold">{youtubeStats.views}</p>
                            <p className="text-sm">Views</p>
                        </div>
                        <div className="bg-slate-50 h-[100px] w-[200px] flex flex-col rounded-2xl items-center justify-center mt-16">
                            <p className="text-xl font-bold">{youtubeStats.likes}</p>
                            <p className="text-sm">Likes</p>
                        </div>
                        <div className="bg-slate-50 h-[100px] w-[200px] flex flex-col rounded-2xl items-center justify-center mt-16">
                            <p className="text-xl font-bold">{youtubeStats.dislikes}</p>
                            <p className="text-sm">Dislikes</p>
                        </div>
                        <div className="bg-slate-50 h-[100px] w-[200px] flex flex-col rounded-2xl items-center justify-center mt-16">
                            <p className="text-xl font-bold">{youtubeStats.comments}</p>
                            <p className="text-sm">Comments</p>
                        </div>
                        <div className="bg-slate-50 h-[100px] w-[200px] flex flex-col rounded-2xl items-center justify-center mt-16">
                            <p className="text-xl font-bold">{youtubeStats.shares}</p>
                            <p className="text-sm">Shares</p>
                        </div>
                    </div>
                    {/* Sentiment Analysis and WordCloud Components */}
                    <div className="flex justify-between p-4">
                        <SentimentAnalysis sentimentData={sentimentData} />
                        <WordCloud wordcloudData={wordcloudData} />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Analytics;
