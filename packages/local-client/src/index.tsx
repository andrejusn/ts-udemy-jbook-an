import 'bulmaswatch/superhero/bulmaswatch.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReactDOM from 'react-dom';
import CellList from './components/cell-list'
import { Provider } from 'react-redux';
import { store } from './state';

const App = () => {

  return <div>
    <Provider store={store}>
      <CellList />
    </Provider>
  </div>;
}

ReactDOM.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
  ,
  document.getElementById('root')
);
