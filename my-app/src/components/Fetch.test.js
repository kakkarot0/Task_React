
import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Fetch from './Fetch';

// Mock the fetch function
let page = 0;
global.fetch = jest.fn(() => {
  page += 1;
  return Promise.resolve({
    json: () => Promise.resolve({
      hits: [
        { objectID: `${page}1`, title: `Test Title Page ${page}`, author: `Test Author Page ${page}`, created_at: '2024-05-27', _tags: ['test'] },
        { objectID: `${page}2`, title: `Another Test Title Page ${page}`, author: `Another Author Page ${page}`, created_at: '2024-05-28', _tags: ['another', 'test'] }
      ]
    }),
  });
});

describe('Fetch component', () => {
  beforeEach(() => {
    fetch.mockClear();
    page = 0; // Reset page before each test
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Fetch />
        </MemoryRouter>
      );
    });
    expect(screen.getByText('Latest Stories')).toBeInTheDocument();
  });

  it('displays fetched data correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Fetch />
        </MemoryRouter>
      );
    });

    await waitFor(() => expect(screen.getByText('Test Title Page 1')).toBeInTheDocument());
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === 'p' && content.includes('Author: Test Author Page 1'))).toBeInTheDocument();
    expect(screen.getByText('Another Test Title Page 1')).toBeInTheDocument();
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === 'p' && content.includes('Author: Another Author Page 1'))).toBeInTheDocument();
  });

  it('filters data based on search term', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Fetch />
        </MemoryRouter>
      );
    });

    await waitFor(() => expect(screen.getByText('Test Title Page 1')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Search by title or author'), { target: { value: 'Another' } });

    expect(screen.queryByText('Test Title Page 1')).not.toBeInTheDocument();
    expect(screen.getByText('Another Test Title Page 1')).toBeInTheDocument();
  });

  
  
});

