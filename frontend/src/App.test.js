import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application header', () => {
  render(<App />);
  const headerElement = screen.getByText(/College Fest Resource Allocation/i);
  expect(headerElement).toBeInTheDocument();
});
