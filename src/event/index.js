const { ipcMain } = require('electron');

const handleEvent = require('../controller/index.js');

function listEvent() {
  /*
    register event to handle
  */
  ipcMain.on('miru:link', handleEvent.linkManga);
}

module.exports = {
  listEvent,
};
