import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ContactUs.css";

function ContactUs() {
  return (
    <div className="App2">
      <div className="head2">
        <div className="contactus-logo">
          <img src="/images/logo_condense.jpg" alt="Logo" />
          <h1> CONDENSE </h1>
        </div>
        <div className="contact-container">
          <div className="contact-form">
            <h2>Contact Us</h2>
            <form>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Your Full Name"
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email Address"
              />
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
              ></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>
          <div className="contact-pic">
            <img src="images/undraw_contact_us_re_4qqt (1).svg" alt="Contact" />
          </div>
        </div>
      </div>
      <div className="contact-details">
        <div className="contact-icon">
          <FontAwesomeIcon icon={["fas", "map-marker-alt"]} />
          <p> &nbsp; &nbsp; &nbsp;IIT ROPAR, Punjab</p>
        </div>
        <div className="contact-icon">
          <FontAwesomeIcon icon={["fas", "phone"]} />
          <p>&nbsp; &nbsp; &nbsp;+911234567890</p>
        </div>
        <div className="contact-icon">
          <FontAwesomeIcon icon={["far", "envelope"]} />
          <p> &nbsp; &nbsp; &nbsp;Team07@iitrpr.ac.in</p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
