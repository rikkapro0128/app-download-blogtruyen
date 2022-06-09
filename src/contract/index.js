const { contextBridge, ipcRenderer } = require('electron');

/*
  register property context window in web-content
  (API comunication with IPC or otherwise)
*/

contextBridge.exposeInMainWorld('electronAPI', {
  handlePercent: (callback) => ipcRenderer.on('update-percent', callback),
  sendLinkManga: (url) => ipcRenderer.send('miru:link', url),
});
