const electron = require('electron');

const centerOnPrimaryDisplay = (winWidth, winHeight) => {
    // Get bounds of primary display
    const primaryDisplay = electron.screen.getPrimaryDisplay();
    const { x, y, width, height } = primaryDisplay.bounds;

    // Create rectangular center on primary display by calculating X and Y coordinates
    const winX = x + (width - winWidth) / 2;
    const winY = y + (height - winHeight) /2;

    return {
        x: winX,
        y: winY,
    };
};

module.exports = centerOnPrimaryDisplay;
