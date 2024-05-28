

import '@testing-library/jest-dom'; 

import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import PostDetail from './PostDetail';
import fetchMock from 'jest-fetch-mock';

describe('PostDetail Component', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders post details', async () => {
    const postId = '1';

    // Mocking the fetch response
    fetchMock.mockResponseOnce(JSON.stringify({
      id: postId,
      title: 'Test Post Title',
      author: 'Test Author',
      created_at: '2024-05-27',
      _tags: ['tag1', 'tag2'],
      text: 'This is a test post content'
    }));

    render(
      <MemoryRouter initialEntries={[`/post/${postId}`]}>
        <Routes>
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the loading spinner to disappear
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    // Assertions
    expect(screen.getByText('Post Details')).toBeInTheDocument();

    const preElement = screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'pre' && content.includes('"title": "Test Post Title"');
    });

    expect(preElement).toBeInTheDocument();
    expect(preElement).toHaveTextContent('"title": "Test Post Title"');
    expect(preElement).toHaveTextContent('"author": "Test Author"');
    expect(preElement).toHaveTextContent('"created_at": "2024-05-27"');
    expect(preElement).toHaveTextContent('"text": "This is a test post content"');
  });
});
