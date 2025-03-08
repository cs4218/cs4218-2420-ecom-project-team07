import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
// Add jest-dom import to get DOM matchers
import '@testing-library/jest-dom';
import axios from 'axios';
import Orders from './Orders';
import moment from 'moment';

// Mock dependencies
jest.mock('axios');
jest.mock('../../components/UserMenu', () => () => <div data-testid="user-menu">User Menu</div>);
jest.mock('../../components/Layout', () => ({ children, title }) => (
  <div data-testid="layout" title={title}>
    <div data-testid="layout-title">{title}</div>
    {children}
  </div>
));
jest.mock('../../context/auth', () => ({
  useAuth: jest.fn(),
}));

describe('Orders Component', () => {
  const mockOrders = [
    {
      _id: '1',
      status: 'Processing',
      buyer: { name: 'Test User' },
      createAt: '2023-01-01T00:00:00.000Z',
      payment: { success: true },
      products: [
        {
          _id: 'p1',
          name: 'Test Product',
          description: 'This is a test product description that is longer than 30 characters',
          price: 99.99
        }
      ]
    },
    {
      _id: '2',
      status: 'Completed',
      buyer: { name: 'Another User' },
      createAt: '2023-02-01T00:00:00.000Z',
      payment: { success: false },
      products: [
        {
          _id: 'p2',
          name: 'Another Product',
          description: 'Short desc',
          price: 49.99
        },
        {
          _id: 'p3',
          name: 'Third Product',
          description: 'Third product description',
          price: 29.99
        }
      ]
    }
  ];

  const mockAuth = {
    token: 'test-token',
    user: { name: 'Test User' }
  };

  const mockSetAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('../../context/auth').useAuth.mockReturnValue([mockAuth, mockSetAuth]);
    axios.get.mockResolvedValue({ data: mockOrders });
  });

  test('renders Orders component with title', async () => {
    // Wrap rendering process with act
    await act(async () => {
      render(<Orders />);
    });
    
    expect(screen.getByTestId('layout-title')).toHaveTextContent('Your Orders');
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(screen.getByText('All Orders')).toBeInTheDocument();
  });

  test('fetches and displays orders when auth token is present', async () => {
    await act(async () => {
      render(<Orders />);
    });
    
    // Verify API call
    expect(axios.get).toHaveBeenCalledWith('/api/v1/auth/orders');
    
    // Check first order information
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    // Use data-testid to uniquely identify elements
    expect(screen.getByTestId('order-number-0')).toHaveTextContent('1');
    
    // Check second order information
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Another User')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByTestId('order-number-1')).toHaveTextContent('2');
    
    // Check product information
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/This is a test product descrip/)).toBeInTheDocument();
    expect(screen.getByText(/Price : 99.99/)).toBeInTheDocument();
    
    expect(screen.getByText('Another Product')).toBeInTheDocument();
    expect(screen.getByText('Short desc')).toBeInTheDocument();
    expect(screen.getByText(/Price : 49.99/)).toBeInTheDocument();
    
    expect(screen.getByText('Third Product')).toBeInTheDocument();
    expect(screen.getByText('Third product description')).toBeInTheDocument();
    expect(screen.getByText(/Price : 29.99/)).toBeInTheDocument();
  });

  test('does not fetch orders when auth token is not present', async () => {
    require('../../context/auth').useAuth.mockReturnValue([{ user: {} }, mockSetAuth]);
    
    await act(async () => {
      render(<Orders />);
    });
    
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('handles API error gracefully', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    axios.get.mockRejectedValue(new Error('API Error'));
    
    await act(async () => {
      render(<Orders />);
    });
    
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
    
    consoleLogSpy.mockRestore();
  });

  test('renders empty state when no orders are returned', async () => {
    axios.get.mockResolvedValue({ data: [] });
    
    await act(async () => {
      render(<Orders />);
    });
    
    expect(axios.get).toHaveBeenCalledWith('/api/v1/auth/orders');
    expect(screen.queryByText('Processing')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
  });

  test('formats date correctly using moment', async () => {
    // Fix moment mock method
    jest.spyOn(moment.prototype, 'fromNow').mockReturnValue('a few days ago');
    
    await act(async () => {
      render(<Orders />);
    });
    
    const dateElements = screen.getAllByText('a few days ago');
    expect(dateElements.length).toBe(2);
    
    moment.prototype.fromNow.mockRestore();
  });
});