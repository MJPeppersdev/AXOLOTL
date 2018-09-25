const { BrowserWindow, ipcMain } = require('electron');
const appConfig = require('electron-settings');


const tourWindowID = appConfig.get('tourWindowID');
const mainWindowID = appConfig.get('mainWindowID');
const previewWindowID = appConfig.get('previewWindowID');
const tourWindow = BrowserWindow.fromId(tourWindowID);
const mainWindow = BrowserWindow.fromId(mainWindowID);
const previewWindow = BrowserWindow.fromId(previewWindowID);

ipcMain.on('start-tour', startTour);
ipcMain.on('end-tour', endTour);

// TOUR
function startTour() {

  saveWinsVisibleState();

  hideAllWindows();

  tourWindow.show();
  tourWindow.focus();

  appConfig.set('tour.isActive', true);
}

function endTour() {

  appConfig.set('tour', {
    hasBeenTaken: true,
    isActive: false,
  });

  tourWindow.hide();

  restoreWindows();

  saveWinsVisibleState();
}

function showWindow(context) {
  const tour = appConfig.get('tour');
  if (tour.isActive) {
    if (context === 'startup') {
      tourWindow.on('ready-to-show', () => {
        tourWindow.show();
        tourWindow.focus();
      });
      return;
    }
    if (context === 'activate') {
      tourWindow.show();
      tourWindow.focus();
      return;
    }
  }
  if (tour.hasBeenTaken) {
    if (context === 'startup') {
      mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
      });
      return;
    }
    if (context === 'activate') {
      restoreWindows();
      return;
    }
  }
  startTour();
}

function restoreWindows() {
  const { isMainWinVisible, isPreviewWinVisible } = appConfig.get(
    'winsLastVisibleState'
  );
  if (!isMainWinVisible && !isPreviewWinVisible) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }
  isMainWinVisible && mainWindow.show();
  isPreviewWinVisible && previewWindow.show();
}


function hideAllWindows() {
  mainWindow.hide();
  previewWindow.hide();
}

function saveWinsVisibleState() {
  appConfig.set('winsLastVisibleState', {
    isMainWinVisible: mainWindow.isVisible(),
    isPreviewWinVisible: previewWindow.isVisible(),
  });
}

module.exports = {
  showWindow,
};
