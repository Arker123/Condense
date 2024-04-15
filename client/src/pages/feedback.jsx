import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./feedback.css";
import Footer from "../components/Footer"
import Navbar from "../components/Navbar/Navbar";
function Feedback() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { fullName, email, message });
    setFullName("");
    setEmail("");
    setMessage("");
    // You can add further logic here, such as sending the form data to a server
  };

  return (
    <>
    <div className="App2">
      <Navbar />
      <div className="feedback-parent">
        <div className="feedback-child1">
            <h1>YOUR FEEDBACK MATTERS!</h1>
            <p>
              We'd love to hear your valuable thoughts on how <br /> Condense can be a better tool for you.
            </p>
            <div  className="w-3/4" ><img src="/images/feedback.png" /> </div>
        </div>
        <div className="feedback-child2">
          <div className="feedback-container">
            <div className="feedback-form" data-testid = "feedback-form">
              <h2>Feedback Form</h2>
              <p>You can reach us anytime</p>
              <form onSubmit={handleSubmit}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  data-testid="name-input"
                  name="fullName"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <label htmlFor="email">Your Email Address</label>
                <input
                  type="email"
                  id="email"
                  data-testid="email-input"
                  name="email"
                  placeholder="jane@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="message">Share Your Thoughts</label>
                <textarea
                  id="message"
                  data-testid="comments-input"
                  name="message"
                  placeholder="Hi, I really liked using . . ."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
                <button type="submit" data-testid="submit-button">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Feedback;

