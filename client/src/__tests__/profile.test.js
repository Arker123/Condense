import Profile from "../pages/Profile.jsx";
import { updatePass } from "../https/index";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

jest.mock("../https/index", () => ({
  ...jest.requireActual("../https/index"),
  updatePass: jest.fn(),
}));

test("profile page renders & update password button opens a dialog to update the password", async () => {
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <Router>
            <Profile />
          </Router>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );

  updatePass.mockResolvedValue({
    status: 200,
  });

  const updatePasswordButton = screen.getByRole("button", {
    name: "Update Password",
  });
  expect(updatePasswordButton).toBeInTheDocument();
  fireEvent.click(updatePasswordButton);

  const currentPasswordInput = screen.getByPlaceholderText("Current Password");
  const newPasswordInput = screen.getByPlaceholderText("New Password");
  const updateButton = screen.getByRole("button", { name: "Update" });
  expect(currentPasswordInput).toBeInTheDocument();
  expect(newPasswordInput).toBeInTheDocument();
  expect(updateButton).toBeInTheDocument();
  fireEvent.change(currentPasswordInput, {
    target: { value: "thisIsAnOldPassword" },
  });
  fireEvent.change(newPasswordInput, {
    target: { value: "thisIsANewPassword" },
  });

  // Click the sign up button
  fireEvent.click(updateButton);
  await waitFor(() => expect(updatePass).toHaveBeenCalled());
});
