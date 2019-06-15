import * as ACTION_TYPES from '../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const updateRecipient = createAction(
  ACTION_TYPES.FORM_RECIPIENT_UPDATE,
  data => data
);

export const addItem = createAction(ACTION_TYPES.FORM_ITEM_ADD);

export const removeItem = createAction(
  ACTION_TYPES.FORM_ITEM_REMOVE,
  itemID => itemID
);

export const updateItem = createAction(
  ACTION_TYPES.FORM_ITEM_UPDATE,
  itemData => itemData
);

export const moveRow = createAction(
  ACTION_TYPES.FORM_ITEM_MOVE,
  (dragIndex, hoverIndex) => ({ dragIndex, hoverIndex })
);

export const clearForm = createAction(
  ACTION_TYPES.FORM_CLEAR,
  (event, muted = false) => muted
);

export const saveFormData = createAction(ACTION_TYPES.FORM_SAVE);

export const toggleFormSettings = createAction(
  ACTION_TYPES.FORM_SETTING_TOGGLE
);

export const closeFormSettings = createAction(ACTION_TYPES.FORM_SETTING_CLOSE);

export const updateSavedFormSettings = createAction(
  ACTION_TYPES.SAVED_FORM_SETTING_UPDATE,
  (setting, data) => ({ setting, data })
);

export const updateFieldData = createAction(
  ACTION_TYPES.FORM_FIELD_UPDATE_DATA,
  (field, data) => ({ field, data })
);

export const toggleField = createAction(
  ACTION_TYPES.FORM_FIELD_TOGGLE,
  field => field
);
