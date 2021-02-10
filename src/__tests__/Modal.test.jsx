import React from 'react';
import {
  render, act, screen, fireEvent,
} from '@testing-library/react';

import App from '../App';

test('opens modal', async () => {
  await act(async () => {
    render(<App />);
  });

  const buttonOpen = screen.getByTestId('btn-modal-open');
  expect(buttonOpen).toBeTruthy();
  fireEvent.click(buttonOpen);

  const modal = screen.getByTestId('modal');
  expect(modal).toBeTruthy();

  const buttonClose = screen.getByTestId('btn-modal-close');
  expect(buttonClose).toBeTruthy();
});

test('displays modal for new player', async () => {
  Storage.prototype.getItem = jest.fn(() => null);

  await act(async () => {
    render(<App />);
  });

  expect(screen.getByTestId('modal')).toBeTruthy();
});

test('does not display modal for recurring player', async () => {
  Storage.prototype.getItem = jest.fn(() => true);

  await act(async () => {
    render(<App />);
  });

  expect(screen.queryByTestId('modal')).toBeNull();
});
