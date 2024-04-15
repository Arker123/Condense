import "jest-canvas-mock";
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Sidebar from "../components/Sidebar";
import "@testing-library/jest-dom";

afterEach(cleanup);

test('In Dashboard Page renders logo and text "Condense" when open is true', () => {
    render(
        <Router>
            <Sidebar />
        </Router>,
    );

    fireEvent.click(screen.getByTestId("SidebarButton"));
    const hiddenDiv = screen.getByText("Condense").parentElement;
    expect(hiddenDiv).toHaveClass("hidden");

    fireEvent.click(screen.getByTestId("SidebarButton"));
    const visibleDiv = screen.getByText("Condense").parentElement;
    expect(visibleDiv).toHaveClass("visible");

    const logoImage = screen.getByTestId("condense-logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "/images/logo_condense.jpg");

    const condenseText = screen.getByText("Condense");
    expect(condenseText).toBeInTheDocument();
});