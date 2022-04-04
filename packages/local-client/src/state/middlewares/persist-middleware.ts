import { Dispatch } from 'redux';
import { Action, PersistCellAction } from '../actions';
import { ActionType } from '../action-types';
import {
  removeCellFromDisk,
  writeCellToDiskAndGetTypeCheckData,
} from '../action-creators';
import { RootState } from '../reducers';

export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  let timer: NodeJS.Timeout;
  return (next: (action: PersistCellAction) => void) => {
    return (action: PersistCellAction) => {
      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // no id when it's a new cell being created, skipping because there is no point in saving a blank file
          if (action.payload.id) {
            // typecheckCode(action.payload.id)(dispatch, getState);
            writeCellToDiskAndGetTypeCheckData(action.payload.id)(
              dispatch,
              getState
            );
          }
        }, 250);
      } else if (ActionType.DELETE_CELL === action.type) {
        if (timer) {
          clearTimeout(timer);
        }
        if (action.payload.id) {
          removeCellFromDisk(action.payload.id)(dispatch, getState);
        }
      }
      next(action);
    };
  };
};
