const { BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const appConfig = require('electron-settings');
const isDev = require('electron-is-dev');


const mainWindowID = appConfig.get('mainWindowID');
const mainWindow = BrowserWindow.fromId(mainWindowID);

autoUpdater.autoDownload = false;

let silentMode = true;


ipcMain.on('check-for-updates', event => {

  silentMode = false;
  checkForUpdate();
});


ipcMain.on('update-download-started', () => {
  autoUpdater.downloadUpdate();
});


autoUpdater.on('checking-for-update', () => {

  if (!silentMode) {
    mainWindow.send('update-checking');
  }
});


autoUpdater.on('update-available', info => {
  mainWindow.send('update-available', info);
});


autoUpdater.on('update-not-available', () => {

  if (!silentMode) {
    mainWindow.send('update-not-available');
  }
});


autoUpdater.on('error', error => {
  let errMessage;
  if (error == null) {
    errMessage = 'Unknown Error';
  } else {
    errMessage = error.message;
  };
  mainWindow.send('update-error', errMessage);
});


autoUpdater.on('download-progress', progressObj => {
  mainWindow.send('update-download-progress', progressObj.percent);
});


autoUpdater.on('update-downloaded', info => {
  mainWindow.send('update-downloaded', info);
});


function checkForUpdate() {

  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
}


checkForUpdate();
