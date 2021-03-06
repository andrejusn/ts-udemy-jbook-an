import 'bulmaswatch/superhero/bulmaswatch.min.css';
import '@fortawesome/fontawesome-free/css/all.css'

import ReactDOM from 'react-dom';
import CellList from './components/cell-list'
import { Provider } from 'react-redux';
import { store } from './state';
import InfoSection from './components/info-section';

const App = () => {

  return <div>
    <Provider store={store}>
      <InfoSection />
      <CellList />
    </Provider>
  </div>;
}

ReactDOM.render(<App />, document.getElementById('root'));
