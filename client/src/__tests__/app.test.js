import "jest-canvas-mock"; // Need because of lottie-files
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup, render } from "@testing-library/react";
import React from "react";
import App from "../App.js";

afterEach(cleanup);

test("app renders without crashing", () => {
    render(
        <Router>
            <App />
        </Router>,
    );
});
