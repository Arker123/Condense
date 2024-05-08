import "jest-canvas-mock";
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Dashboard from "../pages/Dashboard.jsx";
import "@testing-library/jest-dom";

afterEach(cleanup);

test("In Dashboard Page renders dashboard component", () => {
    render(
        <Router>
            <Dashboard />
        </Router>,
    );
    const absorbVideosText = screen.getByText(/Absorb Videos Better Now/i);
    expect(absorbVideosText).toBeInTheDocument();
});

test("In Dashboard Page input field is rendered with correct attributes and input type switching can be done", () => {
    render(
        <Router>
            <Dashboard />
        </Router>,
    );
    const youtubeSummaryButton = screen.getByRole("button", { name: "YouTube Summary" });
    const audioSummaryButton = screen.getByRole("button", { name: "Audio to Summary" });
    const videoSummaryButton = screen.getByRole("button", { name: "Video to Summary" });

    expect(youtubeSummaryButton).toBeInTheDocument();
    expect(audioSummaryButton).toBeInTheDocument();
    expect(videoSummaryButton).toBeInTheDocument();

    fireEvent.click(youtubeSummaryButton);
    const inputLinkField = screen.getByPlaceholderText(
        /Paste Youtube Video link Here!/i,
    );
    expect(inputLinkField).toBeInTheDocument();
    expect(inputLinkField).toHaveAttribute("type", "link");
    
    fireEvent.click(videoSummaryButton);
    const inputVideoField = screen.getByTestId("video");

    expect(inputVideoField).toBeInTheDocument();
    expect(inputVideoField).toHaveAttribute("type", "file");

    fireEvent.click(audioSummaryButton);
    const inputAudioField = screen.getByTestId("audio");
    expect(inputAudioField).toBeInTheDocument();
    expect(inputAudioField).toHaveAttribute("type", "file");

});

test("In Dashboard Page button is rendered with correct attributes and text", () => {
    render(
        <Router>
            <Dashboard />
        </Router>,
    );
    const button = screen.getByText(/Start Summarizing/i);
    expect(button).toBeInTheDocument();
});

test('In Dashboard Page renders "Contact us" button', () => {
    render(
        <Router>
            <Dashboard />
        </Router>,
    );

    const contactUsTexts = screen.getAllByText(/Contact us/i);
    expect(contactUsTexts.length).toBeGreaterThan(0);
});

