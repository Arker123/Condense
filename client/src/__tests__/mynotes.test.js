import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyNotes from "../pages/MyNotes";
import "@testing-library/jest-dom";

describe("MyNotes Component", () => {
  test("renders MyNotes component", async () => {
    render(
      <MemoryRouter>
        <MyNotes />
      </MemoryRouter>
    );

    // Check if the component renders without crashing
    expect(screen.getByText(/Bohemian Rhapsody/i)).toBeInTheDocument();
    expect(screen.getByText(/Postman Beginner's Course/i)).toBeInTheDocument();
    expect(screen.getByText(/Build and Deploy a Modern Web/i)).toBeInTheDocument();
  });
});
