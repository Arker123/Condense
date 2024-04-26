import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyChatBot from '../components/shared/Chatbot/Chatbot';
import "@testing-library/jest-dom";

describe('MyChatBot Component Tests', () => {
    test('should display the open chatbot button initially', () => {
      render(<MyChatBot summary="Sample summary" />);
      const openButton = screen.getByTestId('open-chatbot-button');
      expect(openButton).toBeInTheDocument();
    });
  
    test('should open the chatbot when the open button is clicked', () => {
      render(<MyChatBot summary="Sample summary" />);
      const openButton = screen.getByTestId('open-chatbot-button'); 
      userEvent.click(openButton);
      expect(screen.getByTestId("chatbot-close")).toBeInTheDocument(); 
    });
  
    test('should close the chatbot when the close button is clicked', async () => {
      render(<MyChatBot summary="Sample summary" />);
      const openButton = screen.getByTestId('open-chatbot-button'); 
      userEvent.click(openButton); 
  
      const closeButton = screen.getByTestId('open-chatbot-button'); 
      userEvent.click(closeButton); 
      await expect(screen.queryByTestId("chatbot-open")).not.toBeInTheDocument(); 
    });
});