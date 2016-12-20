import Inferno from 'inferno';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  Inferno.render(<App />, div);
});
