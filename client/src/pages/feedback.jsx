import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './feedback.css';
import { faUser, faHome } from '@fortawesome/free-solid-svg-icons';
import StarRatings from 'react-star-ratings';
import Footer from '../components/shared/Footer';
function Feedback() {
    const [ageGroup, setAgeGroup] = useState('');
    const [occupation, setOccupation] = useState('');
    const [hope, setHope] = useState('');
    const [features, setFeatures] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <>
        <div className='feedback_body'>
            <div className="feedback-header">
                <div className="feedback-logo">
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
            <div className="feedback-form" data-testid = "feedback-form">
                <h1>Feedback Form</h1>
                <h2>Your feedback matters in making Condense a better tool.</h2>
                <form onSubmit={handleSubmit}>
                    
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" data-testid="name-input" />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" data-testid="email-input" />

                    <label htmlFor="ageGroup">What is your age group?</label>
                    <select id="ageGroup" name="ageGroup" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} required data-testid="ageGroup-select">
                        <option value="">Choose</option>
                        <option value="Under 18">Under 18</option>
                        <option value="18 - 24">18 - 24</option>
                        <option value="25 - 34">25 - 34</option>
                        <option value="35 and above">35 and above</option>
                    </select>

                    <label htmlFor="hope">What do you hope Condense can help you with?</label>
                    <select id="hope" name="hope" value={hope} onChange={(e) => setHope(e.target.value)} required data-testid="hope-select">
                        <option value="">Choose</option>
                        <option value="Summarize YouTube videos via ChatGPT">Summarize YouTube videos via ChatGPT</option>
                        <option value="Organize and search notes via AI">Organize and search notes via AI</option>
                        <option value="Take notes while watching videos and save them in the cloud">Take notes while watching videos and save them in the cloud</option>
                        <option value="Share video notes">Share video notes</option>
                        <option value="Summarize Text via ChatGPT">Summarize Text via ChatGPT</option>
                        <option value="Provide transcripts with timestamps">Provide transcripts with timestamps</option>
                    </select>

                    <label htmlFor="features">What new features would you like us to prioritize adding in future updates of the page?</label>
                    <select id="features" name="features" value={features} onChange={(e) => setFeatures(e.target.value)} required data-testid="features-select">
                        <option value="">Choose</option>
                        <option value="AI auto-generate video notes">AI auto-generate video notes</option>
                        <option value="One-click sharing for Transcript & Summary pages">One-click sharing for Transcript & Summary pages</option>
                        <option value="Blog Summary Feature">Blog Summary Feature</option>
                        <option value="Note Classification Management Feature">Note Classification Management Feature</option>
                        <option value="Share notes as images for mobile experience">Share notes as images for mobile experience</option>
                        <option value="AI Chat feature">AI Chat feature</option>
                    </select>
                    <textarea id="message" name="message" rows="3" placeholder='Add your Comment' data-testid="message-textarea"/>
                    <div className="star-ratings" data-testid="rating-input">
                        <label>Rate us:</label>
                        <StarRatings
                            rating={rating}
                            starRatedColor="gold"
                            changeRating={setRating}
                            numberOfStars={5}
                            name='rating'
                            data-testid="star-ratings"
                        />
                    </div>
                    <button type="submit" data-testid="submit-button">Submit</button>
                </form>
            </div>
            <Footer/>
        </div>
        
        </>
    );
}

export default Feedback;
