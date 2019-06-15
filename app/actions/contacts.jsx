import * as ACTION_TYPES from '../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getAllContact = createAction(ACTION_TYPES.CONTACT_GET_ALL);

export const saveContact = createAction(
    ACTION_TYPES.CONTACT_SAVE,
    invoiceData => invoiceData
);

export const deleteContact = createAction(
    ACTION_TYPES.CONTACT_DELETE,
    contactID => contactID
);
