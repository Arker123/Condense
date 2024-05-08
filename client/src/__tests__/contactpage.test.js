import "jest-canvas-mock"; // Needed because of lottie-files
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import React from "react";
import ContactUs from "../pages/ContactUs.jsx";
import "@testing-library/jest-dom";

afterEach(cleanup);

test("contact us page renders without crashing", () => {
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ContactUs />
        </Router>
      </PersistGate>
    </Provider>
  );
});

test("renders contact form with input fields and updates state on input change", () => {
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ContactUs />
        </Router>
      </PersistGate>
    </Provider>
  );

  const fullNameInput = screen.getByLabelText("Full Name");
  const emailInput = screen.getByLabelText("Your Email Address");
  const messageInput = screen.getByLabelText("Your Message");
  const submitButton = screen.getByRole("button", { name: "Submit" });

  expect(fullNameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(messageInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();

  fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
  fireEvent.change(emailInput, { target: { value: "john@example.com" } });
  fireEvent.change(messageInput, { target: { value: "I like this website." } });

  // Check if states are updated
  expect(fullNameInput.value).toBe("John Doe");
  expect(emailInput.value).toBe("john@example.com");
  expect(messageInput.value).toBe("I like this website.");
});
