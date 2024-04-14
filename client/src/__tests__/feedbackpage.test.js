import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Feedback from '../pages/feedback';
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from 'react-router-dom';

test('renders feedback form In Feedback Page', () => {
    const { getByTestId } =  render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Feedback />
                </Router>
            </PersistGate>
        </Provider>,
    );
    expect(getByTestId('feedback-form')).toBeInTheDocument();
    expect(getByTestId('name-input')).toBeInTheDocument();
    expect(getByTestId('email-input')).toBeInTheDocument();
    expect(getByTestId('comments-input')).toBeInTheDocument();
    expect(getByTestId('submit-button')).toBeInTheDocument();
});

test('updates state on input change In Feedback Page', () => {
    const { getByTestId } = render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Feedback />
                </Router>
            </PersistGate>
        </Provider>,
    );
    const nameInput = getByTestId('name-input');
    const emailInput = getByTestId('email-input');
    const commentsInput = getByTestId('comments-input');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(commentsInput, { target: { value: 'I like this website.' } });

    // Check if states are updated
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(commentsInput.value).toBe('I like this website.');
});
