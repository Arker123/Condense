import React, { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "react-modal";
import { MdDeleteOutline } from "react-icons/md"; // Import the MdDeleteOutline icon if you haven't already

const Card = ({ title, youtubeUrl, note, summary }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    // navigate("/summaryAndNote")
    // return <Navigate to="/summaryAndNote" />;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigateToSummary = () => {
    console.log(youtubeUrl);
    navigate("/summaryAndNote", {
      state: { title, note, summary, youtubeUrl },
    });
  };

  const deleteCard = () => {
    // TODO: Add your delete card logic here
  };

  // Function to extract video ID from YouTube URL
  const getVideoId = (url) => {
    const videoIdRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : null;
  };

  // Function to get YouTube thumbnail URL from video ID
  const getThumbnailUrl = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const videoId = getVideoId(youtubeUrl);
  const thumbnailUrl = videoId ? getThumbnailUrl(videoId) : "";

  return (
    <div>
      <div className="bg-gray-200 rounded-md w-[400px] h-[390px] ml-[70px] mt-10">
        <div className="flex flex-col ml-[25px]">
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              className="w-[350px] h-[250px] rounded-md mt-4"
              alt="YouTube Video Thumbnail"
            />
          )}
          <p className="text-black font-medium text-[16px] w-[350px] mt-3">
            {title}
          </p>
          <div className="flex flex-row items-center justify-between">
            <button
              className="bg-red-900 p-2 rounded-lg w-[80px] text-white hover:text-red-200 text-[18px] font font-medium mt-3 hover:font-bold cursor-pointer"
              onClick={navigateToSummary}
            >
              Open
            </button>
            <MdDeleteOutline
              className="mr-5 text-[35px] hover:text-red-900 cursor-pointer"
              onClick={deleteCard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
