import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Feedback from '../pages/feedback';
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "@testing-library/jest-dom";

test('renders feedback form In Feedback Page', () => {
    const { getByTestId } =  render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Feedback />
            </PersistGate>
        </Provider>,
    );
    expect(getByTestId('feedback-form')).toBeInTheDocument();
    expect(getByTestId('name-input')).toBeInTheDocument();
    expect(getByTestId('email-input')).toBeInTheDocument();
    expect(getByTestId('ageGroup-select')).toBeInTheDocument();
    expect(getByTestId('hope-select')).toBeInTheDocument();
    expect(getByTestId('features-select')).toBeInTheDocument();
    expect(getByTestId('rating-input')).toBeInTheDocument();
    expect(getByTestId('submit-button')).toBeInTheDocument();
});

test('updates state on input change In Feedback Page', () => {
    const { getByTestId } = render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Feedback />
            </PersistGate>
        </Provider>,
    );
    const nameInput = getByTestId('name-input');
    const emailInput = getByTestId('email-input');
    const ageGroupSelect = getByTestId('ageGroup-select');
    const hopeSelect = getByTestId('hope-select');
    const featuresSelect = getByTestId('features-select');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(ageGroupSelect, { target: { value: '18 - 24' } });
    fireEvent.change(hopeSelect, { target: { value: 'Summarize YouTube videos via ChatGPT' } });
    fireEvent.change(featuresSelect, { target: { value: 'AI auto-generate video notes' } });

    // Check if states are updated
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(ageGroupSelect.value).toBe('18 - 24');
    expect(hopeSelect.value).toBe('Summarize YouTube videos via ChatGPT');
    expect(featuresSelect.value).toBe('AI auto-generate video notes');
});
