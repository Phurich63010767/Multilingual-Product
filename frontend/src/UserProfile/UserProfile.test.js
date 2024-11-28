import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from './UserProfile';

global.fetch = jest.fn();

describe('UserProfile Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    test('renders loading state initially', () => {
        render(<UserProfile userId="1" />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    test('renders user data after successful fetch', async () => {
        fetch.mockResolvedValue(
            {
                ok : true,
                json : (() => {
                   return {
                    name : "John Doe",
                    email : "john.doe@example.com"
                   }
                })
            }
        );
        render(<UserProfile userId="1" />);
        await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());
        expect(screen.getByText(/Email: john.doe@example.com/i)).toBeInTheDocument();
    });

    test('renders error message when user is not found', async () => {
        fetch.mockResolvedValue(
            {
                ok : false,
            }
        );
        render(<UserProfile userId="999" />);
        await waitFor(() => expect(screen.getByText(/Error: Failed to fetch user data/i)).toBeInTheDocument());
    });

    test('renders error message when user ID is undefined', async () => {
        fetch.mockResolvedValue(
            {
                ok : false,
            }
        );
        render(<UserProfile />);
        await waitFor(() => expect(screen.getByText(/Error: Failed to fetch user data/i)).toBeInTheDocument());
    });
});
