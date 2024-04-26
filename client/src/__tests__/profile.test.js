import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../redux/store';
import Profile from '../pages/Profile';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  );
};

test('renders Profile page', () => {
  renderWithProviders(<Profile />);
  expect(screen.getByText(/USER PROFILE/i)).toBeInTheDocument();
  expect(screen.getByText(/Update Password/i)).toBeInTheDocument();
});

test('switches to Favorite Notes when tab is clicked', async () => {
    renderWithProviders(<Profile />);
    const user = userEvent.setup();
    const notesTab = screen.getByText(/Favorite Notes/i);
    await user.click(notesTab);
    expect(screen.getByText(/There's nothing to show here! Favourite a note to view it here./i)).toBeInTheDocument();
});


const mock = new MockAdapter(axios);

test('fetches favorite summaries and notes and displays them', async () => {
    mock.onGet(`${process.env.REACT_APP_API_URL}/summaries/getFav?userId=1`).reply(200, [
        { _id: '1', title: 'Summary 1', content: 'Content 1' },
        { _id: '2', title: 'Summary 2', content: 'Content 2' }
    ]);
    
    mock.onGet(`${process.env.REACT_APP_API_URL}/note/fav?userId=1`).reply(200, {
    notes: [
        { _id: '1', title: 'Note 1', content: 'Note Content 1' },
        { _id: '2', title: 'Note 2', content: 'Note Content 2' }
    ]
    });

    renderWithProviders(<Profile />);
    console.log(screen.debug());

    expect(await screen.findByTestId("Summary_test")).toBeInTheDocument();

    const user = userEvent.setup();
    const notesTab = screen.getByTestId("FavouriteNotesButton");

    await user.click(notesTab);
    expect(await screen.findByTestId("Notes_test")).toBeInTheDocument();
});


test('displays an error message when summaries cannot be fetched', async () => {
    mock.onGet(`${process.env.REACT_APP_API_URL}/summaries/getFav?userId=1`).networkError();

    renderWithProviders(<Profile />);
    expect(await screen.findByText(/Failed to get all fav summaries/i)).toBeInTheDocument();
});
