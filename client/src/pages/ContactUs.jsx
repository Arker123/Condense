import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ContactUs.css';
import { faUser, faHome } from '@fortawesome/free-solid-svg-icons';

function ContactUs() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { fullName, email, message });
    setFullName('');
    setEmail('');
    setMessage('');
    // You can add further logic here, such as sending the form data to a server
  };

  return (
    <div className="App2">
      <div className='contactus-body'>
        <div className='contactus-header'>
          <div className="contactus-logo">
            <img src="/images/logo_condense.jpg" alt="Logo" />
            <h1> CONDENSE </h1>
          </div>
          <div className="profile-icon">
              <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="home-icon">
              <FontAwesomeIcon icon={faHome} />
          </div>
        </div>
        
        <div className="contact-container">
          <div className="contact-form">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" id="fullName" name="fullName" placeholder="Your Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <input type="email" id="email" name="email" placeholder="Your Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea id="message" name="message" placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
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
          <p>&nbsp; &nbsp; &nbsp;IIT ROPAR, Punjab</p>
        </div>
        <div className="contact-icon">
          <FontAwesomeIcon icon={["fas", "phone"]} />
          <p>&nbsp; &nbsp; &nbsp;+911234567890</p>
        </div>
        <div className="contact-icon">
          <FontAwesomeIcon icon={["far", "envelope"]} />
          <p>&nbsp; &nbsp; &nbsp;Team07@iitrpr.ac.in</p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

