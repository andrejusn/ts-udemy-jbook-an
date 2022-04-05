import { ActionType } from '../action-types';
import { Action } from '../actions';
import produce from 'immer';

interface TypecheckState {
  [key: string]: {
    loading: boolean;
    diags: { message: string; location: string }[];
    error: string;
  };
}

const initialState: TypecheckState = {};

const reducer = produce(
  (state: TypecheckState = initialState, action: Action): TypecheckState => {
    switch (action.type) {
      case ActionType.TYPECHECK_CODE_START:
        state[action.payload.id] = {
          loading: true,
          diags: [],
          error: '',
        };
        return state;

      case ActionType.TYPECHECK_CODE_COMPLETE:
        state[action.payload.id] = {
          loading: false,
          diags: action.payload.diags,
          error: '',
        };

        return state;

      case ActionType.TYPECHECK_CODE_ERROR:
        state[action.payload.id] = {
          loading: false,
          diags: [],
          error: action.payload.errorMessage,
        };

        return state;

      default:
        return state;
    }
  }
);

export default reducer;
