import { ActionType } from '../action-types';
import axios from 'axios';
import {
  Direction,
  MoveCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  UpdateCellAction,
  Action,
  ToggleThemeAction,
  CreateDemoNotesAction,
  RemoveDemoNotesAction,
  PersistCellAction,
} from '../actions';
import { Cell, CellTypes, TypecheckData } from '../cell';
import { Dispatch } from 'redux';
import bundle from '../../bundler';
import { RootState } from '../reducers';
import CellList from '../../components/cell-list';

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return { type: ActionType.MOVE_CELL, payload: { id, direction } };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: { id: id },
  };
};

export const insertCellAfter = (
  id: string | null,
  type: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type,
    },
  };
};

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: { id, content },
  };
};

export const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: { cellId },
    });

    const result = await bundle(input);

    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: { cellId, bundle: result },
    });
  };
};

export const loadNotesFromDisk = () => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.FETCH_CELLS,
    });

    try {
      const { data }: { data: Cell[] } = await axios.get('/cells');

      dispatch({
        type: ActionType.FETCH_CELLS_COMPLETE,
        payload: data,
      });
    } catch (err: any) {
      dispatch({
        type: ActionType.FETCH_CELLS_ERROR,
        payload: err.message,
      });
    }
  };
};

export const saveCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const {
      cells: { data, order },
    } = getState();

    const cells = order.map((id) => data[id]);

    try {
      await axios.post('/cells', { cells });
    } catch (err: any) {
      dispatch({
        type: ActionType.SAVE_CELLS_ERROR,
        payload: err.message,
      });
    }
  };
};

export const writeCellToDisk = (id: string) => {
  return async (
    dispatch: Dispatch<PersistCellAction>,
    getState: () => RootState
  ) => {
    const {
      cells: { data },
    } = getState();

    const cell = data[id];

    try {
      await axios.post('/cell', { cell });
    } catch (err: any) {
      dispatch({
        type: ActionType.PERSIST_CELL_ERROR,
        payload: { id: id, errorMessage: err.message },
      });
    }
  };
};

export const removeCellFromDisk = (id: string) => {
  return async (
    dispatch: Dispatch<PersistCellAction>,
    getState: () => RootState
  ) => {
    const {
      cells: { data },
    } = getState();

    const cell = data[id];

    try {
      await axios.delete('/cell', { data: { cell } });
    } catch (err: any) {
      dispatch({
        type: ActionType.PERSIST_CELL_ERROR,
        payload: { id: cell.id, errorMessage: err.message },
      });
    }
  };
};

export const typecheckCode = (id: string, content: string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const {
      cells: { data },
    } = getState();

    const cell = data[id];
    console.log('cell', cell);

    axios
      .post('/typecheck', { cell })
      .then((response) => {
        console.log('typch response', response);

        dispatch({
          type: ActionType.TYPECHECK_CODE_COMPLETE,
          payload: {
            id: cell.id,
            diags: response.data.data,
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionType.TYPECHECK_CODE_ERROR,
          payload: { id: id, errorMessage: err.message },
        });
      });
  };
};

export const toggleTheme = (): ToggleThemeAction => {
  return {
    type: ActionType.TOGGLE_THEME,
  };
};

export const createDemoNotes = (): CreateDemoNotesAction => {
  return {
    type: ActionType.CREATE_DEMO_NOTES,
  };
};

export const removeDemoNotes = (): RemoveDemoNotesAction => {
  return {
    type: ActionType.REMOVE_DEMO_NOTES,
  };
};
