const { BrowserWindow, ipcMain, shell } = require('electron');
const appConfig = require('electron-settings');
const path = require('path');
const fs = require('fs');

ipcMain.on('save-pdf', (event, docId) => {
    const exportDir = appConfig.get('invoice.exportDir');
    const pdfPath = path.join(exportDir, `${docId}.pdf`);
    const win = BrowserWindow.fromWebContents(event.sender);


    let printOptions;
    if (appConfig.has('general.printOptions')) {
        printOptions = appConfig.get('general.printOptions');
    } else {
        printOptions = {
            landscape: false,
            marginsType: 0,
            printBackground: true,
            printSelectionOnly: false,
        };
    }

    win.webContents.printToPDF(printoptions, (error, data) => {
        if (error) throw error;
        fs.writeFile(pdfPath, data, error => {
            if (error) {
                throw error;
            }
            if (appConfig.get('general.previewPDF')) {
                shell.openExternal('file://' + pdfPath);
            }
            win.webContents.send('pdf-exported', {
                title: 'PDF Exported',
                body: 'Click to reveal file.',
                location: pdfPath,
            });
        });
    });
});

ipcMain.on('reveal-file', (event, location) => {
    shell.showItemInFolder(location);
});
