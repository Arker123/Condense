import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import Analytics from '../pages/Analytics';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';

const mock = new MockAdapter(axios);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: 'someUrl'
  })
}));

jest.mock('@syncfusion/ej2-react-progressbar', () => ({
    ProgressBarComponent: () => <div>Mocked ProgressBar</div>
}));
  
const renderWithRouter = (component) => render(<Router>{component}</Router>);

describe('Analytics Component', () => {
    beforeEach(() => {
      mock.reset();
    });
  
    it('fetches YouTube statistics and renders them', async () => {
        mock.onGet('/youtube-stats').reply(200, {
          views: 100, likes: 50, dislikes: 5, comments: 20, shares: 15
        });
      
        renderWithRouter(<Analytics />);
      
        // Wait for the element to be in the document
        await waitFor(() => {
          const viewsElement = screen.getByTestId("views-count");
          const likesElement = screen.getByTestId("likes-count");
      
          // Check if the elements are actually present in the document
          expect(viewsElement).toBeInTheDocument();
          expect(likesElement).toBeInTheDocument();
      
          // Check if the text content of the elements is a string
          expect(typeof viewsElement.textContent).toBe('string');
          expect(typeof likesElement.textContent).toBe('string');
      
          // Optionally, check if the strings are not empty (if that's a requirement)
          expect(viewsElement.textContent.length).toBeGreaterThan(0);
          expect(likesElement.textContent.length).toBeGreaterThan(0);
        });
      });
      
});
