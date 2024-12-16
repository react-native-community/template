/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { test } from "@jest/globals";
import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
