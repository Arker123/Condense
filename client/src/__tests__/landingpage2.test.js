import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor } from "../redux/store";
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import LandingPage2 from "../pages/LandingPage2";
import "@testing-library/jest-dom";
import { useSelector, useDispatch } from "react-redux"; // Importing useSelector and useDispatch

// Mocking useDispatch and useSelector
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Create the mock store without middleware
const mockStore = configureMockStore();
const initialState = {
  user: {
    id: '1',
    notes: [{ videoId: 'xyz', body: 'Note content' }],
  }
};
const store = mockStore(initialState);


describe("LandingPage2 Component", () => {
    // Mocking useSelector for user data
    useSelector.mockReturnValue({ id: 1, email: "test@example.com" });
  
    test("renders LandingPage2 component", async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <LandingPage2 />
          </MemoryRouter>
        </Provider>
      );
  
      // Check if the component renders without crashing
      expect(screen.getByTestId("summarize_button_landing")).toBeInTheDocument();
    });
  
    test("redirects to dashboard on 'Get started' click", async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <LandingPage2 />
          </MemoryRouter>
        </Provider>
      );
  
      // Click on the 'Get started' button
      fireEvent.click(screen.getByTestId("get_started_button"));
  
      // Wait for the redirect
      await waitFor(() => {
        expect(window.location.pathname).toEqual("/");
      });
    });
  
    test("logs out user", async () => {
      const mockDispatch = jest.fn();
      useDispatch.mockReturnValue(mockDispatch);
  
      render(
        <Provider store={store}>
          <MemoryRouter>
            <LandingPage2 />
          </MemoryRouter>
        </Provider>
      );
  
      // Click on the logout button
      fireEvent.click(screen.getByTestId("logout_testid"));
  
      // Check if dispatch was called with the logout action
      expect(mockDispatch).toHaveBeenCalledWith({ type: "user/logout" });
    });
  });