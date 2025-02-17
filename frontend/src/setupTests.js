// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import 'react';  // This ensures we're using React's act

// Configure testing library
configure({
  asyncUtilTimeout: 1000,
  testIdAttribute: 'data-testid',
}); 