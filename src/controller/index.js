const { dialog, BrowserWindow, ipcMain } = require('electron');

class handleEvent {
  /*
    handle event when match
  */

  linkManga(event, arg) {
    // receive url to exec download manga
    console.log(arg);
  }

  async choosePathSave({ event, arg, mainWindow }) {
    let options = {
      title: 'select floder',
      defaultPath: 'D:\\electron-app',
      buttonLabel: 'Choose this floder',
      properties: ['openDirectory'],
    };
    let dialogInit = await dialog.showOpenDialog(mainWindow, options);
    if (!dialogInit.canceled && dialogInit.filePaths) {
      mainWindow.webContents.send('miru:save--path-storage', {
        pathStorage: dialogInit.filePaths[0],
      });
    }
  }
}

module.exports = new handleEvent();
