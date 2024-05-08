import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MyNotesAndSummaries from '../pages//MyNotesAndSummaries'; // Update this path to where your component is

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

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState = {
  user: {
    id: '1',
    notes: [{ videoId: 'xyz', body: 'Note content' }],
  }
};

const store = mockStore(initialState);

const renderComponent = () =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <MyNotesAndSummaries />
      </BrowserRouter>
    </Provider>
  );

test('renders MyNotesAndSummaries component', () => {
    renderComponent();
    expect(screen.getByText(/My Notes And Summaries/i)).toBeInTheDocument();
});

test('fetches user and summaries on component mount', async () => {
    axios.get.mockResolvedValue({ data: { user: { id: '1', name: 'Test User' } } });
    renderComponent();

    // Wait for the fetch effect to complete
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    // Check if data is fetched and state is updated accordingly
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
});

test('navigates to profile page on profile icon click', () => {
    const { getByRole } = renderComponent();
    fireEvent.click(getByRole('button', { name: /profile/i }));
    // Assuming your routing logic is handled within component
    expect(window.location.pathname).toEqual('/profile');
});
    

  