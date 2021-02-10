import React from 'react';
import { render, act, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';

import App from '../App';
import { URL } from '../utils/api';

afterEach(() => {
  fetchMock.restore();
});

test('renders app without crashing', async () => {
  await act(async () => {
    render(<App />);
  });

  expect(screen.getByTestId('header')).toBeTruthy();
});

test('displays loader', async () => {
  await act(async () => {
    render(<App />);
  });

  expect(screen.getByTestId('loader')).toBeTruthy();
});

test('displays error message', async () => {
  fetchMock.mock(URL, { maze_id: '123' });
  fetchMock.mock(`${URL}/123/print`, 500);

  await act(async () => {
    render(<App />);
  });

  expect(screen.getByTestId('error')).toBeTruthy();
});

test('displays maze', async () => {
  fetchMock.mock(URL, { maze_id: '123' });
  fetchMock.mock(`${URL}/123/print`, 'maze');

  await act(async () => {
    render(<App />);
  });

  expect(screen.getByTestId('message')).toBeTruthy();
  expect(screen.getByTestId('maze')).toBeTruthy();
});
