import SettingsReducer, {
  getCurrentSettings,
  getSavedSettings,
  getDateFormat,
} from '../SettingsReducer';

import FormReducer, {
  getCurrentInvoice,
  getRows,
  getRecipient,
} from '../FormReducer';
import * as ACTION_TYPES from '../../constants/actions.jsx';

const sampleSettings = {
  profile: {
    fullname: 'Axolotl',
    company: 'Axolotl',
    address: '111 Axolotl Drive, CA 95101',
    email: 'info@axolotl.org',
    phone: '+01 (111) 111-1111',
    website: 'http://www.axolotl.org/',
  },
  invoice: {
    exportDir: '/Users/mjp/Desktop',
    template: 'default',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    tax: {
      tin: '123-456-7890',
      method: 'default',
      amount: 0,
    },
    required_fields: {
      dueDate: false,
      currency: false,
      discount: false,
      tax: false,
      note: false,
    },
  },
  general: {
    language: 'en',
    sound: 'default',
    muted: false,
  },
};

const initialState = {};

describe('Settings Reducer', () => {
  it('should handle initial state', () => {
    expect(SettingsReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle get initial setting', () => {
    const data = {
      current: sampleSettings,
      saved: sampleSettings,
    };
    const newState = SettingsReducer(initialState, {
      type: ACTION_TYPES.SETTINGS_GET_INITIAL,
      payload: data,
    });
    expect(newState.loaded).toBeTruthy;
    expect(newState.current).toEqual(sampleSettings);
    expect(newState.saved).toEqual(sampleSettings);
  });

  it('update saved settings', () => {
    const data = sampleSettings;
    const newState = SettingsReducer(initialState, {
      type: ACTION_TYPES.SETTINGS_SAVE,
      payload: data,
    });
    expect(newState.saved).toEqual(data);
  });
});

describe('Settings Reducer should handle update', () => {
  let currentState;
  beforeAll(() => {
    currentState = {
      // loaded: true,
      current: sampleSettings,
      saved: sampleSettings,
    };
  });

  it('general settings', () => {
    const data = {
      muted: false,
      sound: 'modern',
      lang: 'vi',
    };
    const newState = SettingsReducer(currentState, {
      type: ACTION_TYPES.SETTINGS_UPDATE,
      payload: {
        setting: 'general',
        data,
      },
    });
    expect(newState.current.general.muted).toBeFalsy;
    expect(newState.current.general.sound).toEqual('modern');
    expect(newState.current.general.lang).toEqual('vi');
  });

  it('profile settings', () => {
    const data = {
      fullname: 'Tony Stark',
      company: 'Avengers',
      address: 'Avengers Tower',
      email: 'ironman@starkindustries.com',
      website: 'https://avengers.com',
    };
    const newState = SettingsReducer(currentState, {
      type: ACTION_TYPES.SETTINGS_UPDATE,
      payload: {
        setting: 'profile',
        data,
      },
    });
    expect(newState.current.profile.fullname).toEqual('Tony Stark');
    expect(newState.current.profile.company).toEqual('Avengers');
    expect(newState.current.profile.address).toEqual('Avengers Tower');
    expect(newState.current.profile.email).toEqual('ironman@starkindustries.com');
    expect(newState.current.profile.website).toEqual(
      'https://avengers.com'
    );
  });

  it('invoice settings', () => {
    const data = {
      template: 'business',
      currency: 'THB',
      dateFormat: 'MMMM/DDDD/YYYY',
    };
    const newState = SettingsReducer(currentState, {
      type: ACTION_TYPES.SETTINGS_UPDATE,
      payload: {
        setting: 'invoice',
        data,
      },
    });
    expect(newState.current.invoice.template).toEqual('business');
    expect(newState.current.invoice.currency).toEqual('THB');
    expect(newState.current.invoice.dateFormat).toEqual(data.dateFormat);
  });
});

// Test Selectors
const state = {
  settings: {
    current: {},
    saved: {
      invoice: {
        dateFormat: 'DDDD/MMMM/YYYY',
      },
    },
  },
};

describe('Form Selectors', () => {
  it('getCurrentSettings should return currentSettings state', () => {
    expect(getCurrentSettings(state)).toEqual(state.settings.current);
  });
  it('getSavedSettings should return savedSettings state', () => {
    expect(getSavedSettings(state)).toEqual(state.settings.saved);
  });
  it('getDateFormat should return saved dateFormat setting', () => {
    expect(getDateFormat(state)).toEqual(
      state.settings.saved.invoice.dateFormat
    );
  });
});
