import Profile from "../pages/Profile.jsx";
import { updatePass } from "../https/index";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <Router>{ui}</Router>
    </Provider>
  );
};

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

test("renders Profile page", () => {
  renderWithProviders(<Profile />);
  expect(screen.getByText(/USER PROFILE/i)).toBeInTheDocument();
  expect(screen.getByText(/Update Password/i)).toBeInTheDocument();
});

test("switches to Favorite Notes when tab is clicked", async () => {
  renderWithProviders(<Profile />);
  const user = userEvent.setup();
  const notesTab = screen.getByText(/Favorite Notes/i);
  await user.click(notesTab);
  expect(
    screen.getByText(
      /There's nothing to show here! Favourite a note to view it here./i
    )
  ).toBeInTheDocument();
});

const mock = new MockAdapter(axios);

test("fetches favorite summaries and notes and displays them", async () => {
  mock
    .onGet(`${process.env.REACT_APP_API_URL}/summaries/getFav?userId=1`)
    .reply(200, [
      { _id: "1", title: "Summary 1", content: "Content 1" },
      { _id: "2", title: "Summary 2", content: "Content 2" },
    ]);

  mock.onGet(`${process.env.REACT_APP_API_URL}/note/fav?userId=1`).reply(200, {
    notes: [
      { _id: "1", title: "Note 1", content: "Note Content 1" },
      { _id: "2", title: "Note 2", content: "Note Content 2" },
    ],
  });

  renderWithProviders(<Profile />);
  console.log(screen.debug());

  expect(await screen.findByTestId("Summary_test")).toBeInTheDocument();

  const user = userEvent.setup();
  const notesTab = screen.getByTestId("FavouriteNotesButton");

  await user.click(notesTab);
  expect(await screen.findByTestId("Notes_test")).toBeInTheDocument();
});

test("displays an error message when summaries cannot be fetched", async () => {
  mock
    .onGet(`${process.env.REACT_APP_API_URL}/summaries/getFav?userId=1`)
    .networkError();

  renderWithProviders(<Profile />);
  expect(
    await screen.findByText(/Failed to get all fav summaries/i)
  ).toBeInTheDocument();
});
