import React from 'react';
import {cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SummaryPage from '../pages/SummaryPage.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useLocation } from 'react-router-dom';

afterEach(cleanup);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useLocation: jest.fn(), // mock the hook
}));

test('In Summary Page Transcript text is rendered', () => {

    useLocation.mockReturnValue({
        state: "https://www.youtube.com/watch?v=zJU_Bp-Yp1c&ab_channel=Avatar%3ATheLastAirbender",
    });
    
    render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <SummaryPage />
                </Router>
            </PersistGate>
        </Provider>
    );
    const transcripts = screen.getByTestId("transcript-test");
    expect(transcripts).toBeInTheDocument();
});

test('In Summary Page Notes text is rendered', () => {

    useLocation.mockReturnValue({
        state: "https://www.youtube.com/watch?v=zJU_Bp-Yp1c&ab_channel=Avatar%3ATheLastAirbender",
    });

    render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <SummaryPage />
                </Router>
            </PersistGate>
        </Provider>
    );
    const notes = screen.getByTestId("notes-test");
    expect(notes).toBeInTheDocument();
});

test('In Summary Page summary text is rendered', () => {

    useLocation.mockReturnValue({
        state: "https://www.youtube.com/watch?v=zJU_Bp-Yp1c&ab_channel=Avatar%3ATheLastAirbender",
    });

    render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <SummaryPage />
                </Router>
            </PersistGate>
        </Provider>
    );
    const summary = screen.getByTestId("summary-test");
    expect(summary).toBeInTheDocument();
});
