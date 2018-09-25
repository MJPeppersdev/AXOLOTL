const { BrowserWindow, ipcMain } = require('electron');
const appConfig = require('electron-settings');
const previewWindowID = appConfig.get('previewWindowID');
const previewWindow = BrowserWindow.fromId(previewWindowID);
const mainWindowID = appConfig.get('mainWindowID');
const mainWindow = BrowserWindow.fromId(mainWindowID);

ipcMain.on('preview-invoice', (event, invoiceData) => {
    previewWindow.show();
    previewWindow.focus();
    previewWindow.webContents.send('update-preview', invoiceData);
});

ipcMain.on('update-preview-window', (event, newConfigs) => {
    previewWindow.webContents.send('update-preview-window', newConfigs);
});

ipcMain.on('change-preview-window-language', (event, newLang) => {
    previewWindow.webContents.send('change-preview-window-language', newLang);
});

ipcMain.on('change-preview-window-profile', (event, newProfile) => {
    previewWindow.webContents.send('change-preview-window-profile', newProfile);
});

ipcMain.on('save-configs-to-invoice', (event, invoiceID, configs) => {
    mainWindow.webContents.send('save-configs-to-invoice', invoiceID, configs);
});

