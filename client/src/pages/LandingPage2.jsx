import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import "./LandingPage2.css"; 
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/shared/Navbar/Navbar";

import Footer from "../components/shared/Footer";
import { useDispatch, useSelector } from "react-redux";

const data = [
  {
    img: "/images/feature_img1.webp",
    title: "Summarize Videos",
    body: "Summarize Videos to revolutionize your video-watching experience. Say goodbye to lengthy videos that eat up your time. With this powerful tool, we transform lengthy videos into concise summaries, capturing the essence of the video in just a fraction of the time.",
  },
  {
    img: "/images/feature_img2.webp",
    title: "Chrome Extension With Youtube Integration",
    body: "Generates a concise summary of the currently playing YouTube video automatically, providing users with key insights and information. Enables users to ask questions or provide prompts related to the video content, receiving AI-generated responses.",
  },
  {
    img: "/images/feature_img3.webp",
    title: "Ask AI From Videos",
    body: "This feature has unique functionality integrated into our Chrome extension that allows users to extract information and gain insights from videos using AI-powered algorithms. This feature enables users to ask questions about the video content and receive relevant answers in real-time, enhancing their understanding and engagement with the video material.",
  },
  {
    img: "/images/feature_img4.webp",
    title: "Audio to Summary Converter",
    body: "Allows users to convert audio content, such as podcasts, lectures, or interviews, into concise and easy-to-read summaries. Utilizes advanced speech recognition algorithms to transcribe the audio content and summarise the content accurately.",
  },
  {
    img: "/images/feature_img5.webp",
    title: "Youtube Videos Sentiment Analysis By Comments",
    body: "Analyze the sentiment of comments on YouTube videos, categorizing them as positive, negative, or neutral. Provides users with visualizations and trends of comments over time, allowing them to track the sentiment of the audience.",
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

function LandingPage2() {
  AOS.init();
  const user = useSelector((state) => state.user);
  console.log(user.id);
  const email = user.email;
  console.log("email=> ", email);

  let webSocket = null;
  const handleStart = () => {
    webSocket = new WebSocket("ws://localhost:443/");
    if (webSocket) {
      webSocket.onopen = (event) => {
        console.log("Connected to server");
        webSocket.send("Hello from client");
        webSocket.onmessage = (event) => {
          console.log(event);
        };
      };
    }
  };

  const handleStop = () => {
    if (webSocket) webSocket.close();
    // websocket = null
  };

  return (
    <>
      <div className="App bg-gradient-to-b p-8">
        <Navbar />
        <div className=" flex flex-col items-center justify-center mt-28 gap-5  text-white">
          <div className="text-7xl font-bold">
            <p className="">Summarize </p>
            <p className="">Effortlessly</p>
          </div>
          <p className="text-lg">Condense long videos into short summaries.</p>
          <Link
            to="/dashboard"
            className="bg-[#5a377b] p-3 rounded-lg px-16 mt-8 hover:bg-[#42285a]"
          >
            Get started!
          </Link>
          <button onClick={handleStart}>Start</button>
          <button onClick={handleStop}>Stop</button>
        </div>
        <div className="flex flex-wrap justify-around gap-14 p-10 mt-36 font-['Gothic A1']">
          {/* {data.map((item) => (
          <Card item={item} />
        ))}
        <Card item={data[0]} /> */}
          <div data-aos="fade-right">
            <div className="flex h-[300px] w-[600px] hover:scale-105 duration-150 justify-between bg-[rgba(255,255,255,0.7)] overflow-hidden border rounded-lg shadow-lg">
              <div className="flex w-1/2 flex-col p-5">
                <div className="text-xl font-semibold">{data[0].title}</div>
                <div className="p-1 pt-5 text-justify">{data[0].body}</div>
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
                <div className="p-1 pt-5 text-justify">{data[1].body}</div>
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
                <div className="p-1 pt-5 text-justify">{data[2].body}</div>
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
                <div className="p-1 pt-5 text-justify">{data[3].body}</div>
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
                <div className="p-1 pt-5 text-justify">{data[4].body}</div>
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
      <Footer />
    </>
  );
}

export default LandingPage2;
