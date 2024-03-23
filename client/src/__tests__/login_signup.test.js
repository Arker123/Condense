import React from "react";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SignUp from "../pages/SignUp";
import { login, Register } from "../https/index"; // Import login and Register functions
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";

afterEach(cleanup);

jest.mock("axios", () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: {
                use: jest.fn(),
            },
            response: {
                use: jest.fn(),
            },
        },
    })),
}));

jest.mock("../https/index", () => ({
    ...jest.requireActual("../https/index"),
    Register: jest.fn(),
    login: jest.fn(),
}));

test("Renders sign up form and submits it", async () => {
    render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SignUp />
            </PersistGate>
        </Provider>,
    );

    Register.mockResolvedValue({
        status: 200,
    });

    fireEvent.click(screen.getByTestId("Register-header-test"));

    // Fill out the form fields
    fireEvent.change(screen.getByTestId("email-test"), {
        target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("username-test"), {
        target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-test"), {
        target: { value: "test123" },
    });
    fireEvent.change(screen.getByTestId("confirmpassword-test"), {
        target: { value: "test123" },
    });

    // Click the sign up button
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // Wait for API call to complete
    await waitFor(() => expect(Register).toHaveBeenCalled());
});

test("Renders login form and submits it", async () => {
    render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SignUp />
            </PersistGate>
        </Provider>,
    );

    login.mockResolvedValue({ status: 200 });

    // Fill out the form fields
    fireEvent.change(screen.getByTestId("email-test2"), {
        target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-test2"), {
        target: { value: "test123" },
    });

    // Click the login button
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Wait for API call to complete
    await waitFor(() => expect(login).toHaveBeenCalled());
});
