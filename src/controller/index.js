const { dialog, BrowserWindow } = require('electron');

class handleEvent {
  /*
    handle event when match
  */

  linkManga(event, arg) {
    // receive url to exec download manga
    console.log(arg);
  }

  async choosePathSave({ event, arg, mainWindow }) {
    console.log(arg);
    let options = {
      // See place holder 1 in above image
      title: 'Custom title bar',

      // See place holder 2 in above image
      defaultPath: 'D:\\electron-app',

      // See place holder 3 in above image
      buttonLabel: 'Custom button',

      // See place holder 4 in above image
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
        { name: 'Custom File Type', extensions: ['as'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      properties: ['openFile', 'multiSelections'],
    };
    let filePaths = await dialog.showOpenDialog(mainWindow, options);
    console.log(filePaths);
  }
}

module.exports = new handleEvent();
