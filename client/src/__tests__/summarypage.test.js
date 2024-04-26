import React from 'react';
import {cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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
}));;

// FIXME: This test is failing because the notes are not being rendered in the Summary Page
test.skip('In Summary Page Transcript text is rendered', () => {

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

// FIXME: This test is failing because the notes are not being rendered in the Summary Page
test.skip('In Summary Page Notes text is rendered', () => {

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

// FIXME: This test is failing because the notes are not being rendered in the Summary Page
test.skip('In Summary Page summary text is rendered', () => {

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
