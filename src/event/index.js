const { ipcMain } = require('electron');

const handleEvent = require('../controller/index.js');

function listEvent(mainWindow) {
  /*
    register event to handle
  */
  ipcMain.on('miru:link', handleEvent.linkManga);
  ipcMain.on('miru:start-clone', handleEvent.startClone);
  ipcMain.on('miru:choose-path-save', (event, arg) => {
    handleEvent.choosePathSave({ event, arg, mainWindow });
  });
}

module.exports = {
  listEvent,
};
