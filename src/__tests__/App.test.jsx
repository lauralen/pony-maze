import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import fetchMock from 'fetch-mock';

import App from '../App';
import { URL } from '../utils/api';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  fetchMock.restore();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('renders app without crashing', async () => {
  await act(async () => {
    render(<App />, container);
  });

  expect(container.querySelector("[data-testid='header']")).toBeTruthy();
});

test('displays loader', async () => {
  await act(async () => {
    render(<App />, container);
  });

  expect(container.querySelector("[data-testid='loader']")).toBeTruthy();
});

test('displays error message', async () => {
  fetchMock.mock(URL, { maze_id: '123' });
  fetchMock.mock(`${URL}/123/print`, 500);

  await act(async () => {
    render(<App />, container);
  });

  expect(container.querySelector("[data-testid='error']")).toBeTruthy();
});

test('displays maze', async () => {
  fetchMock.mock(URL, { maze_id: '123' });
  fetchMock.mock(`${URL}/123/print`, 'maze');

  await act(async () => {
    render(<App />, container);
  });

  expect(container.querySelector("[data-testid='message']")).toBeTruthy();
  expect(container.querySelector("[data-testid='maze']")).toBeTruthy();
});
