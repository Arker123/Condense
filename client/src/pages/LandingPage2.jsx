import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./LandingPage2.css"; // Make sure to create an App.css file for styling
import AOS from "aos";
import "aos/dist/aos.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";

import Footer from "../components/shared/Footer";
const data = [
  {
    img: "/images/feature_img1.webp",
    title: "Summarize videos",
    body: "Summarize Videos and revolutionize your video-watching experience. Say goodbye to lengthy videos that eat up your time. With this powerful tool, we transform lengthy video content into concise summaries, capturing the essence of the video in just a fraction of the time.",
  },
  {
    img: "/images/feature_img2.webp",
    title: "Chrome Extension With Youtube Integration",
    body: "Automatically generates a concise summary of the currently playing YouTube video, providing users with key insights and information.Enables users to ask questions or provide prompts related to the video content, receiving AI-generated responses for further clarification or information.",
  },
  {
    img: "/images/feature_img3.webp",
    title: "Ask AI From Videos",
    body: "This feature has unique functionality integrated into our Chrome extension that allows users to extract information and gain insights from videos using AI-powered algorithms. This feature enables users to ask questions about the video content and receive relevant answers in real-time, enhancing their understanding and engagement with the video material.",
  },
  {
    img: "/images/feature_img4.webp",
    title: "Audio to Summary Converter",
    body: "Allows users to convert audio content, such as podcasts, lectures, or interviews, into concise and easy-to-read summaries. Utilizes advanced speech recognition algorithms to accurately transcribe the audio content and generate a summary that captures the key points and highlights of the audio material.",
  },
  {
    img: "/images/feature_img5.webp",
    title: "Youtube Videos Sentiment Analysis By Comments",
    body: "Utilizes algorithms to analyze the sentiment of comments on YouTube videos, categorizing them as positive, negative, or neutral. Provides users with visualizations and trends of comments over time, allowing them to track the sentiment of the audience towards the video content.",
  },
  {
    img: "/images/feature_img6.webp",
    title: "Make Notes of Videos and Save for later View",
    body: "Allows users to take notes in real time while watching videos, providing a dedicated space to capture key information and thoughts. Automatically timestamps notes to indicate the exact moment in the video when the note was taken, making it easy to reference specific parts of the video later.",
  },
];

function Card({ item }) {
  return (
    <div className="flex h-[300px] w-[600px] justify-between bg-[rgba(255,255,255,0.7)] overflow-hidden border rounded-lg shadow-lg">
      <div className="flex w-1/2 flex-col p-5">
        <div className="text-xl font-semibold">{item.title}</div>
        <div className="p-5">{item.body}</div>
      </div>
      <div>
        <img className="h-full w-full" src={item.img}></img>
      </div>
    </div>
  );
}
// function Card({ item }) {
//   return (
//     <div className="flex flex-col w-[500px] bg-[rgba(255,255,255,0.7)] overflow-hidden border rounded-lg shadow-lg">
//       <div className="h-96 w-full">
//         <img className="h-full w-full" src={item.img} />
//       </div>

//       <div className="p-2">
//         <div className="text-xl">{item.title}</div>
//         <div className="text-justify p-2 text-md">{item.body}</div>
//       </div>
//     </div>
//   );
// }

function LandingPage2() {
  const user = useSelector((state) => state.user);
  AOS.init();

  const dispatch = useDispatch();

  return (
    <>
    <div className="App bg-gradient-to-b p-8">
      <header className="App-header">
        <div className="logo2">
          <img src="/images/logo_condense.jpg" alt="Logo" />
        </div>

        <nav className="flex justify-between w-full font-['Dosis'] text-xl">
          <div></div>

          <div className="flex gap-24 ">
            <Link to="/landing">
              <FontAwesomeIcon icon={faHome} />
            </Link>

            <Link to="">Chrome Extension</Link>
            <Link to="/ytsummaries">Youtube Summaries</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            {user.email ? (
              <button
                onClick={() => dispatch(logout())}
                className="p-2 px-3 bottom-2 relative border rounded-lg hover:bg-[rgba(255,255,255,0.2)]"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signup"
                className="p-2 border rounded-lg hover:bg-[rgba(255,255,255,0.2)]"
              >
                Login/SignUp
              </Link>
            )}
          </div>
        </nav>
      </header>
      <div className=" flex flex-col items-center justify-center mt-28 gap-5  text-white">
        <div className="text-7xl font-bold">
          <p className="">Summarize </p>
          <p className="">Effortlessly</p>
        </div>
        <p className="text-lg">Condense long videos into short summaries</p>
        <Link
          to="/dashboard"
          className="bg-[#5a377b] p-3 rounded-lg px-16 mt-8 hover:bg-[#42285a]"
        >
          Get started
        </Link>
      </div>
      <div className="flex flex-wrap justify-around gap-14 p-10 mt-36 font-['Dosis']">
        {/* {data.map((item) => (
          <Card item={item} />
        ))}
        <Card item={data[0]} /> */}
        <div data-aos="fade-right">
          <div className="flex h-[300px] w-[600px] hover:scale-105 duration-150 justify-between bg-[rgba(255,255,255,0.7)] overflow-hidden border rounded-lg shadow-lg">
            <div className="flex w-1/2 flex-col p-5">
              <div className="text-xl font-semibold">{data[0].title}</div>
              <div className="p-2 pt-5 text-justify">{data[0].body}</div>
            </div>
            <div>
              <img className="h-full w-full" src={data[0].img}></img>
            </div>
          </div>
        </div>
        <div data-aos="fade-left">
          <div className="flex h-[300px] w-[600px] hover:scale-105 duration-150 justify-between bg-[rgba(255,255,255,0.7)] overflow-hidden border rounded-lg shadow-lg">
            <div className="flex w-1/2 flex-col p-5">
              <div className="text-xl font-semibold">{data[1].title}</div>
              <div className="p-2 pt-5 text-justify">{data[1].body}</div>
            </div>

            <div>
              <img className="h-full w-full" src={data[1].img}></img>
            </div>
          </div>
        </div>
        <div data-aos="zoom-in">
          <div className="flex h-[300px] w-[750px] hover:scale-105 duration-150 justify-between bg-[rgba(255,255,255,0.7)] overflow-hidden border rounded-lg shadow-lg">
            <div className="flex w-1/2 flex-col p-5">
              <div className="text-xl font-semibold">{data[2].title}</div>
              <div className="p-2 pt-5 text-justify">{data[2].body}</div>
            </div>

            <div>
              <img className="h-full w-full" src={data[2].img}></img>
            </div>
          </div>
        </div>

        <div data-aos="fade-right">
          <div className="flex h-[300px] w-[600px] hover:scale-105 duration-150 justify-between bg-[rgba(255,255,255,0.7)] overflow-hidden border rounded-lg shadow-lg">
            <div className="flex w-1/2 flex-col p-5">
              <div className="text-xl font-semibold">{data[3].title}</div>
              <div className="p-2 pt-5 text-justify">{data[3].body}</div>
            </div>
            <div>
              <img className="h-full w-full" src={data[3].img}></img>
            </div>
          </div>
        </div>

        <div data-aos="fade-left">
          <div className="flex h-[300px] w-[600px] hover:scale-105 duration-150 justify-between bg-[rgba(255,255,255,0.7)] overflow-hidden border rounded-lg shadow-lg">
            <div className="flex w-1/2 flex-col p-5">
              <div className="text-xl font-semibold">{data[4].title}</div>
              <div className="p-2 pt-5 text-justify">{data[4].body}</div>
            </div>

            <div>
              <img className="h-full w-full" src={data[4].img}></img>
            </div>
          </div>
        </div>

        <div data-aos="zoom-in">
          <div className="flex h-[300px] w-[750px] hover:scale-105 duration-150 justify-between bg-[rgba(255,255,255,0.7)] overflow-hidden border rounded-lg shadow-lg">
            <div className="flex w-1/2 flex-col p-5">
              <div className="text-xl font-semibold">{data[5].title}</div>
              <div className="p-2 pt-5 text-justify">{data[5].body}</div>
            </div>
            <div>
              <img className="h-full w-full" src={data[5].img}></img>
            </div>
          </div>
        </div>

       
      </div>
      
    </div>
    <Footer/>
    </>
  );
}

export default LandingPage2;
