const { ipcMain } = require('electron');

const handleEvent = require('../controller/index.js');

function listEvent(mainWindow) {
  /*
    register event to handle
  */
  ipcMain.on('miru:donwload-link-mangas', handleEvent.downloadLinkManga);
  ipcMain.on('miru:analysis-link-mangas', (event, { info }) => {
    handleEvent.analysisLinkManga({ info, mainWindow });
  });
  ipcMain.on('miru:start-clone', ({ linkManga }) => {
    handleEvent.startClone({ mainWindow, linkManga });
  });
  ipcMain.on('miru:choose-path-save', (event, arg) => {
    handleEvent.choosePathSave({ event, arg, mainWindow });
  });
}

module.exports = {
  listEvent,
};
