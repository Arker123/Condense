import React, { useEffect, useState } from 'react'
import NoteAndSummary from '../components/shared/Card/NoteAndSummaryCard'
import { useDispatch, useSelector } from "react-redux";
import { setUserSlice } from "../redux/userSlice";
import { CgProfile } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const MyNotesAndSummaries = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);

    const handleRedirect = () => {
        navigate('/contact');
      };
    
      const handleProfileRedirect = () => {
        navigate('/profile');
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await yourApiCall(); // Your API call here
                const { user, accessToken, refreshToken } = response.data;
                dispatch(setUserSlice({ user, accessToken, refreshToken }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData(); // Call fetchData function when component mounts
    }, []); // Empty dependency array ensures effect runs only once when component mounts

  return (
    <div className="h-screen">

        <section className="flex flex-col gap-6 bg-gradient-to-b from-gray-900 via-gray-800 to-red-900 h-full w-full overflow-auto pb-4">
            <div className="flex flex-row items-center justify-between mt-7">
                {/* Heading on the left */}
                <h1 className="text-3xl font-bold text-white ml-[80px]">My Notes And Summaries</h1>

                {/* Icons on the right */}
                <div className="flex flex-row items-center gap-4 mr-14">
                    <div className="w-30 h-10 rounded-3xl bg-white flex items-center px-4 hover:bg-gray-200">
                        <div className="flex flex-row gap-2" onClick={handleRedirect}>
                            <FiPhoneCall className="mt-1" />
                            <p className="cursor-pointer">Contact us</p>
                        </div>
                    </div>

                    <div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full">
                        <IoMdSettings />
                    </div>

                    <div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full">
                        <IoIosNotifications />
                    </div>

                    <div className="bg-white w-10 h-[40px] flex items-center text-[30px] justify-center rounded-full cursor-pointer" onClick={handleProfileRedirect}>
                        <CgProfile />
                    </div>
                </div>
            </div>


            <div className="flex flex-wrap gap-6 h-full pb-8">
                <NoteAndSummary 
                    title="Your Note Title 1"  
                    youtubeUrl="https://www.youtube.com/watch?v=yj3lm00cZSg&ab_channel=SonyLIV" 
                    note="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    summary="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                />
                <NoteAndSummary title="Your Note Title 2"  youtubeUrl="https://www.youtube.com/watch?v=yj3lm00cZSg&ab_channel=SonyLIV"/>
                <NoteAndSummary title="Your Note Title 2"  youtubeUrl="https://www.youtube.com/watch?v=yj3lm00cZSg&ab_channel=SonyLIV"/>
                <NoteAndSummary title="Your Note Title 2"  youtubeUrl="https://www.youtube.com/watch?v=yj3lm00cZSg&ab_channel=SonyLIV"/>
                <NoteAndSummary title="Your Note Title 2"  youtubeUrl="https://www.youtube.com/watch?v=yj3lm00cZSg&ab_channel=SonyLIV"/>
                {/* Add more NoteAndSummary components for each note or summary */}
            </div>
        </section>
    </div>
  )
}

export default MyNotesAndSummaries