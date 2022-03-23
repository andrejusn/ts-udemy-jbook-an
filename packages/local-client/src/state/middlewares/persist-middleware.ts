import { Dispatch } from 'redux';
import { Action, CellAction, PersistCellAction } from '../actions';
import { ActionType } from '../action-types';
import { saveCell } from '../action-creators';
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
      next(action);
      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // no id when it's a new cell being created, skipping because there is no point in saving a blank file
          if (action.payload.id) {
            saveCell(action.payload.id)(dispatch, getState);
          }
        }, 250);
      }
    };
  };
};
