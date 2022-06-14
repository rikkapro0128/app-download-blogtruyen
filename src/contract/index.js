const { contextBridge, ipcRenderer } = require('electron');

/*
  register property context window in web-content
  (API comunication with IPC or otherwise)
*/

contextBridge.exposeInMainWorld('electronAPI', {
  savePathStorage: (callback) => ipcRenderer.on('miru:save--path-storage', callback),
  appendTask: (callback) => ipcRenderer.on('miru:update-task', callback),
  sendLinkManga: (url) => ipcRenderer.send('miru:link', { url }),
  popupChooseFloder: (options) => ipcRenderer.send('miru:choose-path-save', options),
});
