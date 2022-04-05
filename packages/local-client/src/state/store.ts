import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { persistMiddleware } from './middlewares/persist-middleware';
import { typecheckMiddleware } from './middlewares/typecheck-middleware';

export const store = createStore(
  reducers,
  {},
  applyMiddleware(persistMiddleware, typecheckMiddleware, thunk)
);
