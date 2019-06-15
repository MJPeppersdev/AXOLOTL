import * as ACTION_TYPES from '../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getInitialSettings = createAction(
    ACTION_TYPES.SETTINGS_GET_INITIAL
);

export const updateSettings = createAction(
    ACTION_TYPES.SETTINGS_UPDATE,
    (setting, data) => ({ setting, data })
);

export const saveSettings = createAction(
    ACTION_TYPES.SETTINGS_SAVE,
    data => data
);
