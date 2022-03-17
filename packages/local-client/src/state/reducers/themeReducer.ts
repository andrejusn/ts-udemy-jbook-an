import { ActionType } from '../action-types';
import { Action } from '../actions';
import produce from 'immer';

interface ThemeState {
  darkTheme: boolean;
}

const initialState: ThemeState = {
  darkTheme: true,
};

const reducer = produce(
  (state: ThemeState = initialState, action: Action): ThemeState => {
    switch (action.type) {
      case ActionType.TOGGLE_THEME:
        state.darkTheme = !state.darkTheme;
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
