import 'jest-canvas-mock'; // Needed because of lottie-files
import {BrowserRouter as Router} from 'react-router-dom';
import {cleanup, render, screen} from '@testing-library/react';
import React from 'react';
import ContactUs from '../pages/ContactUs.jsx';
import '@testing-library/jest-dom';

afterEach(cleanup);

test('contact us page renders without crashing', () => {
    render(
        <Router>
            <ContactUs />
        </Router>,
    );
});

test('renders contact form with input fields', () => {
    render(
        <Router>
            <ContactUs />
        </Router>,
    );

    const fullNameInput = screen.getByPlaceholderText('Your Full Name');
    const emailInput = screen.getByPlaceholderText('Your Email Address');
    const messageInput = screen.getByPlaceholderText('Your Message');
    const submitButton = screen.getByRole('button', {name: 'Submit'});

    expect(fullNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
});
