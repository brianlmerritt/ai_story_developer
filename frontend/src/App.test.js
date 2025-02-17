import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders main title', () => {
    render(<App />);
    const titleElement = screen.getByText(/AGI Novel/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders navigation buttons', () => {
    render(<App />);
    const buttons = [
      'Brainstorm',
      'Scenes',
      'Characters',
      'Locations',
      'Discoveries',
      'Memories'
    ];
    
    buttons.forEach(buttonText => {
      expect(screen.getByText(buttonText)).toBeInTheDocument();
    });
  });

  test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
}); 