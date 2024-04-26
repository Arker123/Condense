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
    const videoId = match ? match[1] : null;
    console.log("Video ID:", videoId);
    return videoId;
  };

  // Function to get YouTube thumbnail URL from video ID
  const getThumbnailUrl = (videoId) => {
    const thumbnailUrl = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "";
    console.log("Thumbnail URL:", thumbnailUrl);
    return thumbnailUrl;
  };

  const videoId = getVideoId(youtubeUrl);
  const thumbnailUrl = videoId ? getThumbnailUrl(videoId) : "";

  return (
    <div>
      {/* <div className="bg-gray-200 rounded-2xl w-[400px] h-[370px] ml-[70px] mt-10 hover:bg-slate-300">
        <div className="flex flex-col ">
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              className="w-[400px] h-[250px] rounded-2xl "
              alt="YouTube Video Thumbnail"
            />
          )}
          <p className="text-black font-medium text-[18px] w-[350px] mt-3 ml-[20px]">
            {title}
          </p>
          <div className="flex flex-row items-center justify-between">
            <button
              className="bg-red-900 p-2 rounded-lg w-[80px] text-white hover:text-red-200 text-[18px] font font-medium mt-3 hover:font-bold cursor-pointer ml-[20px]"
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
      </div> */}
      <div className="bg-gray-200 rounded-2xl w-[400px] h-[370px] ml-[70px] mt-10 overflow-hidden hover:scale-105 transition-all duration-300 ease-in-out hover:bg-slate-300">
  <div className="flex flex-col">
    {thumbnailUrl && (
      <img
        src={thumbnailUrl}
        className="w-[400px] h-[250px] rounded-2xl"
        alt="YouTube Video Thumbnail"
      />
    )}
    <p className="text-black font-medium text-[18px] w-[350px] mt-3 ml-[20px]">
      {title}
    </p>
    <div className="flex flex-row items-center justify-between">
      <button
        className="bg-red-900 p-2 rounded-lg w-[80px] text-white hover:text-red-200 text-[18px] font font-medium mt-3 hover:font-bold cursor-pointer ml-[20px]"
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
