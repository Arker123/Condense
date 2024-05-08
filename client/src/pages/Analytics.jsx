import React, { useEffect, useState, } from "react";
import axios from "axios";
import JSON5 from "json5";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { motion } from "framer-motion";
import CountUp from 'react-countup';
import { ProgressBarComponent } from '@syncfusion/ej2-react-progressbar';



// SentimentAnalysis component to display sentiment analysis data
// SentimentAnalysis component to display sentiment analysis data
const SentimentAnalysis = ({ sentimentData }) => {
    const [startCounting, setStartCounting] = useState(false);
    const [startCounting1, setStartCounting1] = useState(false);
    const [startCounting2, setStartCounting2] = useState(false);
    const total = sentimentData.positiveComments + sentimentData.negativeComments + sentimentData.neutralComments
    useEffect(() => {
        const timer = setTimeout(() => {
            setStartCounting(true);
            setStartCounting1(true);
            setStartCounting2(true);
        }, 500); // Adjust the delay time as needed

        return () => clearTimeout(timer); // Cleanup function
    }, []);

    return (
        <div className="bg-slate-50 h-[210px] w-[400px] flex flex-col rounded-2xl mt-5 ">
            <p className="text-[28px] font-bold w-[290px]   flex items-center justify-center mt-1 text-[#6f0000]">Sentiment Analysis</p>
            <div className="flex flex-col gap-2 mt-5 ">
                <p className="text-[20px] flex flex-row gap-2 ml-[25px] font-medium">
                    Positive: 
                    <ProgressBarComponent id="linear" type='Linear' height='35' value={sentimentData.positive} animation={{
                        enable: true,
                        duration: 2000,
                        delay: 0
                    }}

                    />
                    {startCounting && (
                        <CountUp start={0} end={(sentimentData.positiveComments*100)/total} duration={2.5} /> // end mein {sentimentData.positive} daal dena
                    )}%
                </p>
                {/*  */}
                <p className="text-[20px] flex flex-row gap-2 ml-[15px] font-medium">
                    Negative:
                    <ProgressBarComponent id="Negative" type='Linear' height='35' value={sentimentData.negative} animation={{ // value mein {sentimentData.positive} daal dena
                        enable: true,
                        duration: 2000,
                        delay: 0
                    }}

                    />
                    {startCounting1 && (
                        <CountUp start={0} end={(sentimentData.negativeComments*100)/total} duration={2.5} /> // Adjust duration as needed
                    )}%
                </p>
                <p className="text-[20px] flex flex-row gap-2 ml-[15px] font-medium mb-3">
                    Neutral:

                    <ProgressBarComponent id="Neutral" type='Linear' height='35' value={sentimentData.neutral} animation={{ // value mein {sentimentData.positive} daal dena
                        enable: true,
                        duration: 2000,
                        delay: 0
                    }}

                    />
                    {startCounting2 && (
                        <CountUp start={0} end={(sentimentData.neutralComments*100)/total} duration={2.5} /> // Adjust duration as needed
                    )}%
                </p>
            </div>
        </div>
    );
};

// WordCloud component to display word cloud data
const WordCloud = ({ wordcloudData }) => {
    // Render word cloud data here
    return (
        <div className="bg-slate-50 h-[300px] w-[800px] flex flex-col rounded-2xl  mt-4">
            <p className=" ml-[25px] mt-2.5 text-[28px] font-bold text-[#6f0000]">Word Cloud</p>
            <p className="ml-[25px] text-[18px] font-normal">{wordcloudData}</p>
        </div>
    );
};


const Analytics = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const url = searchParams.get("url");
    console.log("url:", url);
    const [startCounting, setStartCounting] = useState(false);

    var [wordcloudData, setWordCloudData] = useState([]);
    var [youtubeStats, setYoutubeStats] = useState({
        positiveComments: 0,
        negativeComments : 0,
        neutralComments : 0
    });
    const [sentimentData, setSentiment] = useState({
        views: 0,
        likes: 0,
        dislikes: 0,
        comments: 0,
        shares: 0,
    })

    useEffect(() => {
        axios.post(
            `${process.env.REACT_APP_API_URL}/youtube-stats`,
            {
                url,
            }
        )
        .then(response => {
            const stats = JSON5.parse(response.data.statistics);
            console.log(stats)
            const lines = stats.split('\n');

            const result = {
                positiveComments: parseInt(lines[2].match(/Positive comments: (\d+)/)[1]),
                negativeComments: parseInt(lines[3].match(/Negative comments: (\d+)/)[1]),
                neutralComments: parseInt(lines[4].match(/Neutral comments: (\d+)/)[1])
            };
            const engagementMetrics = {
                views: parseInt(lines[7].match(/Views: (\d+)/)[1]),
                likes: parseInt(lines[8].match(/Likes: (\d+)/)[1]),
                dislikes: parseInt(lines[9].match(/Dislikes: (\d+)/)[1]),
                comments: parseInt(lines[10].match(/Comments: (\d+)/)[1]),
                shares: parseInt(lines[11].match(/Shares: (\d+)/)[1])
            };
            const cloud = lines[12]
            setSentiment(result)
            setYoutubeStats(engagementMetrics)
            setWordCloudData(cloud)
        })
        .catch(error => {
            console.error('Error fetching YouTube statistics:', error);
        });
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

    return (
        <>
            <section className="flex flex-row gap-6 bg-gradient-to-b from-black to-[#6f0000] h-screen">
                <Sidebar />
                <div className="w-full flex flex-col">
                    <div>
                        <div className="flex groupside justify-end p-2 gap-4 mt-5 mr-4">
                            <div className="w-30 h-10 sidebuttons rounded-3xl flex items-center px-4">
                                <div className="flex flex-row gap-2" onClick={handleRedirect}>
                                    <FiPhoneCall className="mt-1" />
                                    <p className="cursor-pointer">Contact Us</p>
                                </div>
                            </div>
                            <div className="w-10 h-[40px] sidebuttons flex items-center text-[30px] justify-center rounded-full cursor-pointer" onClick={handleProfileRedirect}>
                                <CgProfile />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-[90px]  ">
                        <SentimentAnalysis sentimentData={sentimentData} className="mr-[50px]" />
                        <div className="border border-white h-[110px] w-[180px] flex flex-col rounded-2xl  mt-2 items-center">
                            <p data-testid="views-title" className="text-[35px] text-slate-50 font-sans font-bold mt-1" >Views</p>
                            <p data-testid="views-count" className="text-[35px] text-slate-50  font-bold">{startCounting && (
                                <CountUp start={0} end={50} duration={2.5} /> 
                            )}
                                {youtubeStats.views}
                            </p>

                        </div>
                        <div className="border border-white h-[110px] w-[180px] flex flex-col rounded-2xl  mt-2 items-center">
                            <p className="text-[35px] text-slate-50 font-sans font-bold mt-1">Likes</p>
                            <p data-testid="likes-count" className="text-[35px] text-slate-50  font-bold">{startCounting && (
                                <CountUp start={0} end={50} duration={2.5} /> 
                            )}
                                {youtubeStats.likes}
                            </p>

                        </div>
                        <div className="border border-white h-[110px] w-[180px] flex flex-col rounded-2xl  mt-2 items-center">
                            <p className="text-[35px] text-slate-50 font-sans font-bold mt-1">Dislikes</p>
                            <p className="text-[35px] text-slate-50  font-bold">{startCounting && (
                                <CountUp start={0} end={50} duration={2.5} /> 
                            )}
                                {youtubeStats.dislikes}
                            </p>

                        </div>


                    </div>

                    {/* YouTube Statistics Boxes */}
                    <div className="flex flex-row  items-center justify-center gap-[150px]">
                        <div className="flex flex-col ml-[50px] mt-10 gap-[20px] ">
                            <div className="border border-white h-[110px] w-[200px] flex flex-col rounded-2xl  mt-2 items-center">
                                <p className="text-[35px] text-slate-50 font-sans font-bold mt-1">Comments</p>
                                <p className="text-[35px] text-slate-50  font-bold">{startCounting && (
                                    <CountUp start={0} end={50} duration={2.5} />
                                )}
                                    {youtubeStats.comments}
                                </p>

                            </div>
                            <div className="border border-white h-[110px] w-[180px] flex flex-col rounded-2xl  mt-2 items-center ml-3">
                                <p className="text-[35px] text-slate-50 font-sans font-bold mt-1">Shares</p>
                                <p className="text-[35px] text-slate-50  font-bold">{startCounting && (
                                    <CountUp start={0} end={50} duration={2.5} />
                                )}
                                    {youtubeStats.shares}
                                </p>

                            </div>

                        </div>
                        <WordCloud wordcloudData={wordcloudData} />
                    </div>

                </div>
            </section>
        </>
    );
};

export default Analytics;
