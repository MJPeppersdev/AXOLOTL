import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as actions from '../contacts';

it('getAllContacts should create GET_ALL_CONTACTS action', () => {
  expect(actions.getAllContacts()).toEqual({
    type: ACTION_TYPES.CONTACT_GET_ALL,
  });
});

it('saveContact should create SAVE_CONTACT action', () => {
  const contactData = {
    _id: 'tony_stark',
    fulname: 'Tony Stark',
    email: 'ironman@starkindustries.com',
  };
  expect(actions.saveContact(contactData)).toEqual({
    type: ACTION_TYPES.CONTACT_SAVE,
    payload: contactData,
  });
});

it('deleteContact should create DELETE_CONTACT action', () => {
  expect(actions.deleteContact('tony_stark')).toEqual({
    type: ACTION_TYPES.CONTACT_DELETE,
    payload: 'tony_stark',
  });
});
