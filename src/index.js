import Inferno from 'inferno';
import App from './App';
import './index.css';

Inferno.disableRecycling();

Inferno.render(
  <App />,
  document.getElementById('root')
);
