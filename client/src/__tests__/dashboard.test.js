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

test("In Dashboard Page input field is rendered with correct attributes", () => {
    render(
        <Router>
            <Dashboard />
        </Router>,
    );
    const inputField = screen.getByPlaceholderText(
        /Paste Youtube Video link Here!/i,
    );
    expect(inputField).toBeInTheDocument();
    expect(inputField).toHaveAttribute("type", "link");
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

test('In Dashboard Page renders "Contact us" text', () => {
    render(
        <Router>
            <Dashboard />
        </Router>,
    );

    const contactUsTexts = screen.getAllByText(/Contact us/i);
    expect(contactUsTexts.length).toBeGreaterThan(0);
});

