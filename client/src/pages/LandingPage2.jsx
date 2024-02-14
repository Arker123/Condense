import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './LandingPage2.css'; // Make sure to create an App.css file for styling

function LandingPage2() {
  return (
    <div className="App">
      <header className="App-header">
      <div className="logo">
          <img src="/images/logo_condense.jpg" alt="Logo" />
        </div>
      <nav className="navbar">
        <ul>
            <li><a href="#home"><FontAwesomeIcon icon={faHome} /></a></li>
            <li><a href="#extension">Chrome Extension</a></li>
            <li><a href="#summaries">Youtube Summaries</a></li>
            <li><a href="#contact">Contact</a></li>
      </ul>
      </nav>
      </header>
      <div className="user-actions">
          <a href="/login" className="login-signup-button">Login/Sign Up</a>
      </div>
      <div className="hero">
        <h1>CONDENSE.</h1>
        <p>VIDEO TO SUMMARY</p>
      </div>
      <div className='container'>
        <div className='item1'> 
          <h3> Youtube Summarizer </h3>
        </div>
        <div className='item2'> 
          <h3> Chrome Extension With Youtube Integration </h3> 
        </div>
        <div className='item3'> 
        <h3> Ask AI From Videos </h3> 
        </div>
        <div className='item4'> 
          <h3> Audio to Summary Converter </h3>
        </div>
        <div className='item5'> 
        <h3> Youtube Videos Sentiment Analysis By Comments </h3>
        </div>
        <div className='item6'> 
          <h3>Make Notes of Videos and Save for later View</h3>
        </div>
      </div>
    </div>
  );
}

export default LandingPage2;