import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import axios from 'axios';
import MyNotesAndSummaries from '../pages/MyNotesAndSummaries'; // Update this path to where your component is

// Mock axios
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

// Mock API functions
jest.mock("../https/index", () => ({
    ...jest.requireActual("../https/index"),
    Register: jest.fn(),
    login: jest.fn(),
}));

// Create the mock store without middleware
const mockStore = configureMockStore();
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
});