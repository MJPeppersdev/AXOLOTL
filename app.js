console.time('init');

const fs    = require('fs');
const os    = require('os');
const url   = require('url');
const path  = require('path');
const glob  = require('glob');
const isDev = require('electron-is-dev');
const omit  = require('lodash').omit;

const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

const centerOnPrimaryDisplay = require('./helpers/center-on-primary-display');

const forceDevtools = process.argv.includes('--force-devtools');
if (process.argv.includes('--disable-hardware-acceleration')) {
    app.disableHardwareAcceleration();
}

const appConfig = require('electron-settings');
require('dotenv').config();

let tourWindow = null;
let mainWindow = null;
let previewWindow = null;

function createTourWindow() {
    const width = 700;
    const height = 600;

    const winPOS = centerOnPrimaryDisplay(width, height);

    tourWindow = new BrowserWindow({
        x: winPOS.x,
        y: winPOS.y,
        width,
        height,
        show: false,
        frame: false,
        resizable: false,
        moveable: false,
        title: 'Tour Window',
        backgroundColor: '#F9FAFA',
    });
    appConfig.set('tourWindowID', parseInt(tourWindow.id));
    tourWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './tour/index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );
    tourWindow.on('show', event => {
        if (isDev || forceDevtools) tourWindow.webContents.closeDevTools();
        tourWindow.hide();
    });
}

function createMainWindow() {
    const mainWindownStateKeeper = windowStateKeeper('main');
    mainWindow = new BrowserWindow({
        x: mainWindownStateKeeper.x,
        y: mainWindownStateKeeper.y,
        width: mainWindownStateKeeper.width,
        height: mainWindownStateKeeper.height,
        minWidth: 600,
        minHeight: 400,
        backgroundColor: '#2e2c29',
        show: false,
        title: 'Main Window',
    });
    appConfig.set('mainWindowID', parseInt(mainWindow.id));
    mainWindownStateKeeper.track(mainWindow);
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './app/index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );
    mainWindow.on('show', event => {
        if (isDev || forceDevtools) mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
    mainWindow.on('close', event => {
        if (process.platform === 'darwin') {
            event.preventDefault();
            if (isDev || forceDevtools) mainWindow.webContents.closeDevTools();
            mainWindow.hide();
        } else {
            app.quit();
        }
    });
}

function createPreviewWindow() {
    const previewWindownStateKeeper = windowStateKeeper('preview');
    previewWindow = new BrowserWindow({
        x: previewWindownStateKeeper.x,
        y: previewWindownStateKeeper.y,
        width: previewWindownStateKeeper.width,
        height: previewWindownStateKeeper.height,
        minWidth: 1024,
        minHeight: 800,
        backgroundColor: '#2e2c29',
        show: false,
        title: 'Preview Window',
    });
    appConfig.set('previewWindowID', parseInt(previewWindow.id));
    previewWindownStateKeeper.track(previewWindow);
    previewWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './preview/index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );
    previewWindow.on('show', event => {
        if (isDev || forceDevtools) previewWindow.webContents.openDevTools({ mode: 'detach' });
    });
    previewWindow.on('close', event => {
        event.preventDefault();
        if (isDev || forceDevtools) previewWindow.webContents.closeDevTools();
        previewWindow.hide();
    });
}

function addDevToolsExtension() {
    if (process.env.DEVTRON_DEV_TOOLS_PATH)
      BrowserWindow.addDevToolsExtension(process.env.DEVTRON_DEV_TOOLS_PATH);
    if (process.env.REACT_DEV_TOOLS_PATH)
      BrowserWindow.addDevToolsExtension(process.env.REACT_DEV_TOOLS_PATH);
    if (process.env.REDUX_DEV_TOOLS_PATH)
      BrowserWindow.addDevToolsExtension(process.env.REDUX_DEV_TOOLS_PATH);
}

function setInitialValues() {
    const logoPath = path.resolve(__dirname, './static/imgs/default_logo.svg');
    const logoData = fs.readFileSync(logoPath);
    const logoBase64String =
        'data:image/svg+xml;base64,' + logoData.toString('base64');
    const defaultOptions = {
        tour: {
            isActive: false,
            hasBeenTaken: false,
        },
        winsLastVisibleState: {
            isMainWinVisible: true,
            isPreviewWinVisible: false,
        },
        profile: {
            logo: logoBase64String,
            fullname: 'AXOLOTL Preservation Society',
            company: 'AXOLOTL Preservation Society',
            address: 'Calle Vialidad de La Barranca #6 | Centro Comercial Paseo Interlomas, Mexico City 52787, Mexico',
            email: 'info@axolotl.org',
            phone: '+05 641-4932',
            website: 'https://www.axolotlsociety.org/',
        },
        general: {
            language: 'en',
            sound: 'default',
            muted: false,
            previewPDF: true,
            checkUpdate: 'daily',
            lastCheck: Date.now(),
          },
          invoice: {
            exportDir: os.homedir(),
            template: 'default',
            dateFormat: 'MM/DD/YYYY',
            tax: {
              tin: '123-456-789',
              method: 'default',
              amount: 0,
            },
            currency: {
              code: 'USD',
              placement: 'before',
              separator: 'commaDot',
              fraction: 2,
            },
            required_fields: {
              invoiceID: false,
              dueDate: false,
              currency: false,
              discount: false,
              tax: false,
              note: false,
            },
          },
        };

  for (const key in defaultOptions) {
    if (Object.prototype.hasOwnProperty.call(defaultOptions, key)) {
      if (!appConfig.has(`${key}`)) {
        appConfig.set(`${key}`, defaultOptions[key]);
      }
      for (const childKey in defaultOptions[key]) {
        if (Object.prototype.hasOwnProperty.call(defaultOptions[key], childKey)) {
          if (!appConfig.has(`${key}.${childKey}`)) {
            appConfig.set(`${key}.${childKey}`, defaultOptions[key][childKey]);
          }
        }
      }
    }
  }
}

function migrateData() {
  const migrations = {
    1: configs => {
      const { info, appSettings } = configs;
      if (info === undefined || appSettings === undefined) {
        return configs;
      }
      const migratedConfigs = Object.assign({}, configs, {
        profile: info,
        general: {
          language: appSettings.language,
          sound: appSettings.sound,
          muted: appSettings.muted,
        },
        invoice: {
          exportDir: appSettings.exportDir,
          template: appSettings.template,
          currency: appSettings.currency,
          dateFormat: 'MM/DD/YYYY',
          tax: {
            tin: '123-456-789',
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
      });
      return omit(migratedConfigs, [
        'info',
        'appSettings',
        'printOptions',
        'test',
      ]);
    },

    2: configs => {
      if ( configs.invoice.currency.placement !== undefined) {
        return configs;
      }
      return Object.assign({}, configs, {
        invoice: Object.assign({}, configs.invoice, {
          currency: {
            code: configs.invoice.currency,
            placement: 'before',
            separator: 'commaDot',
            fraction: 2,
          }
        })
      });
    },

    3: configs => {
      const { checkUpdate, lastCheck} = configs.general;
      if ( checkUpdate === undefined || lastCheck === undefined ) {
        return configs;
      }
      return Object.assign({}, configs, {
        general: omit(configs.general, ['checkUpdate', 'lastCheck'])
      });
    },
  };
  const configs = appConfig.getAll();
  const version = appConfig.get('version') || 0;
  const newMigrations = Object.keys(migrations)
    .filter(k => k > version)
    .sort();
  if (!newMigrations.length) return;
  const migratedConfigs = newMigrations.reduce(
    (prev, key) => migrations[key](prev),
    configs
  );
  appConfig.deleteAll().setAll(migratedConfigs)
  appConfig.set('version', newMigrations[newMigrations.length - 1]);
}

function addEventListeners() {
  ipcMain.on('quit-app', () => {
    app.quit();
  });
  ipcMain.on('quit-and-install', () => {
    setImmediate(() => {
      app.removeAllListeners("window-all-closed");
      tourWindow.destroy();
      mainWindow.destroy();
      previewWindow.destroy();
      autoUpdater.quitAndInstall(false);
    })
  });
}

function loadMainProcessFiles() {
  const files = glob.sync(path.join(__dirname, 'main/*.js'));
  files.forEach(file => require(file));
}

function windowStateKeeper(windowName) {
  let window, windowState;

  function setBounds() {
    if (appConfig.has(`windowState.${windowName}`)) {
      windowState = appConfig.get(`windowState.${windowName}`);
      return;
    }
    // Default
    windowState = {
      x: undefined,
      y: undefined,
      width: 1000,
      height: 800,
    };
  }

  function saveState() {
    if (!windowState.isMaximized) {
      windowState = window.getBounds();
    }
    windowState.isMaximized = window.isMaximized();
    appConfig.set(`windowState.${windowName}`, windowState);
  }

  function track(win) {
    window = win;
    ['resize', 'move'].forEach(event => {
      win.on(event, saveState);
    });
  }

  setBounds();

  return {
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    isMaximized: windowState.isMaximized,
    track,
  };
}

function initialize() {
  app.on('ready', () => {
    createTourWindow();
    createMainWindow();
    createPreviewWindow();
    setInitialValues();
    migrateData();
    if (isDev) addDevToolsExtension();
    addEventListeners();
    loadMainProcessFiles();
    // Show Window
    const { showWindow } = require('./main/tour');
    showWindow('startup');
  });
  // Reactivate the app
  app.on('activate', () => {
    const { showWindow } = require('./main/tour');
    showWindow('activate');
  });
  app.on('before-quit', () => {
    if (tourWindow !== null) tourWindow.destroy();
    if (mainWindow !== null) mainWindow.destroy();
    if (previewWindow !== null) previewWindow.destroy();
  });
  console.timeEnd('init');
}

initialize();
