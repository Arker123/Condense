import React from 'react';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import SummaryPage from '../pages/SummaryPage';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('axios')

afterEach(cleanup);
const mockStore = configureStore([]);
let store;

beforeEach(() => {
    store = mockStore({
        user: { id: 1 },
        data: {
        notes: [
            { videoId: '1', body: 'Note 1' },
            { videoId: '2', body: 'Note 2' }
        ]
        }
    });
});

test('renders SummaryPage component', () => {
    render(
        <Provider store={store}>
        <Router>
            <SummaryPage />
        </Router>
        </Provider>
    );
    const noteTextArea = screen.getByPlaceholderText('Enter your note...');
    expect(noteTextArea).toBeInTheDocument();
});

test('fetches summary when mounted', async () => {
    const mockSummaryText = 'Mock summary text';
    axios.post.mockResolvedValueOnce({ data: mockSummaryText });
    render(
        <MemoryRouter initialEntries={['/summary']}>
        <Provider store={store}>
            <SummaryPage />
        </Provider>
        </MemoryRouter>
);

expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/summary/generate', {
    url: undefined
});

await waitFor(() => {
        expect(screen.getByText(mockSummaryText)).toBeInTheDocument();
    });
});

test('saves summary when save button is clicked', async () => {
const mockSummaryText = 'Mock summary text';
axios.post.mockResolvedValueOnce({ data: mockSummaryText });
axios.post.mockResolvedValueOnce({ data: 'Summary saved' });

render(
    <MemoryRouter initialEntries={['/summary']}>
    <Provider store={store}>
        <SummaryPage />
    </Provider>
    </MemoryRouter>
);

fireEvent.click(screen.getByText('Save Summary'));

await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(2);
        expect(axios.post).toHaveBeenCalledWith('/saveSummary', {
        userId: 1,
        videoId: undefined,
        summaryBody: mockSummaryText
        });
    });
});