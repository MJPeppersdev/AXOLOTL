import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as actions from '../invoices';

it('getInvoices should create INVOICE_GET_ALL action', () => {
  expect(actions.getInvoices()).toEqual({
    type: ACTION_TYPES.INVOICE_GET_ALL,
  });
});

it('saveInvoice should create INVOICE_SAVE action', () => {
  const invoiceData = {
    _id: 'tony_stark',
    fulname: 'Tony Stark',
    email: 'ironman@starkindustries.com',
  };
  expect(actions.saveInvoice(invoiceData)).toEqual({
    type: ACTION_TYPES.INVOICE_SAVE,
    payload: invoiceData,
  });
});

it('duplicateInvoice should create INVOICE_DUPLICATE action', () => {
  const invoiceData = {
    _id: 'tony_stark',
    fulname: 'Tony Stark',
    email: 'ironman@starkindustries.com',
  };
  expect(actions.duplicateInvoice(invoiceData)).toEqual({
    type: ACTION_TYPES.INVOICE_DUPLICATE,
    payload: invoiceData,
  });
});

it('newInvoiceFromContact should create INVOICE_NEW_FROM_CONTACT action', () => {
  const contactData = {
    _id: 'tony_stark',
    fulname: 'Tony Stark',
    email: 'ironman@starkindustries.com',
  };
  expect(actions.newInvoiceFromContact(contactData)).toEqual({
    type: ACTION_TYPES.INVOICE_NEW_FROM_CONTACT,
    payload: contactData,
  });
});

it('deleteInvoice should create INVOICE_DELETE action', () => {
  expect(actions.deleteInvoice('tony_stark')).toEqual({
    type: ACTION_TYPES.INVOICE_DELETE,
    payload: 'tony_stark',
  });
});

it('editInvoice should create INVOICE_EDIT action', () => {
  const invoiceData = {
    _id: 'tony_stark',
    fulname: 'Tony Stark',
    email: 'ironman@starkindustries.com',
  };
  expect(actions.editInvoice(invoiceData)).toEqual({
    type: ACTION_TYPES.INVOICE_EDIT,
    payload: invoiceData,
  });
});

it('updateInvoice should create INVOICE_UPDATE action', () => {
  const invoiceData = {
    _id: 'tony_stark',
    fulname: 'Tony Stark',
    email: 'ironman@starkindustries.com',
  };
  expect(actions.updateInvoice(invoiceData)).toEqual({
    type: ACTION_TYPES.INVOICE_UPDATE,
    payload: invoiceData,
  });
});

it('setInvoiceStatus should create INVOICE_SET_STATUS action', () => {
  const invoiceID = 'tony_stark';
  const status = 'pending';
  expect(actions.setInvoiceStatus(invoiceID, status)).toEqual({
    type: ACTION_TYPES.INVOICE_SET_STATUS,
    payload: {
      invoiceID: 'tony_stark',
      status: 'pending',
    },
  });
});

it('saveInvoiceConfigs should create INVOICE_CONFIGS_SAVE action', () => {
  const invoiceID = 'tony_stark';
  const configs = {
    color: 'red'
  };
  expect(actions.saveInvoiceConfigs(invoiceID, configs)).toEqual({
    type: ACTION_TYPES.INVOICE_CONFIGS_SAVE,
    payload: {
      invoiceID: 'tony_stark',
      configs: {
        color: 'red'
      }
    }
  });
});
