import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./LandingPage2.css"; // Make sure to create an App.css file for styling
import AOS from "aos";
import "aos/dist/aos.css";

const data = [
  {
    img: "/images/img1.jpg",
    title: "Summarize videos",
    body: "Summarize Videos and revolutionize your video-watching experience. Say goodbye to lengthy videos that eat up your time. With this powerful tool, we transform lengthy video content into concise summaries, capturing the essence of the video in just a fraction of the time.",
  },
  {
    img: "/images/img2.jpg",
    title: "Summarize videos",
    body: "Summarize Videos and revolutionize your video-watching experience. Say goodbye to lengthy videos that eat up your time. With this powerful tool, we transform lengthy video content into concise summaries, capturing the essence of the video in just a fraction of the time.",
  },
  {
    img: "/images/img3.jpg",
    title: "Summarize videos",
    body: "Summarize Videos and revolutionize your video-watching experience. Say goodbye to lengthy videos that eat up your time. With this powerful tool, we transform lengthy video content into concise summaries, capturing the essence of the video in just a fraction of the time.",
  },
  {
    img: "/images/img3.jpg",
    title: "Summarize videos",
    body: "Summarize Videos and revolutionize your video-watching experience. Say goodbye to lengthy videos that eat up your time. With this powerful tool, we transform lengthy video content into concise summaries, capturing the essence of the video in just a fraction of the time.",
  },
  {
    img: "/images/img3.jpg",
    title: "Summarize videos",
    body: "Summarize Videos and revolutionize your video-watching experience. Say goodbye to lengthy videos that eat up your time. With this powerful tool, we transform lengthy video content into concise summaries, capturing the essence of the video in just a fraction of the time.",
  },
  {
    img: "/images/img3.jpg",
    title: "Summarize videos",
    body: "Summarize Videos and revolutionize your video-watching experience. Say goodbye to lengthy videos that eat up your time. With this powerful tool, we transform lengthy video content into concise summaries, capturing the essence of the video in just a fraction of the time.",
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
  AOS.init();

  return (
    <div className="App bg-gradient-to-b p-8">
      <header className="App-header">
        <div className="logo">
          <img src="/images/logo_condense.jpg" alt="Logo" />
        </div>

        <nav className="flex justify-between w-full font-['Dosis'] text-xl">
          <div></div>

          <div className="flex gap-24 ">
            <Link to="/landing">
              <FontAwesomeIcon icon={faHome} />
            </Link>

            <Link to="">Chrome Extension</Link>
            <Link to="/dashboard">Youtube Summaries</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <Link
              to="/signup"
              className="p-2 border rounded-lg hover:bg-[rgba(255,255,255,0.2)]"
            >
              Login/SignUp
            </Link>
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
  );
}

export default LandingPage2;
