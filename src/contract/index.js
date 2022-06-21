const { contextBridge, ipcRenderer } = require('electron');

/*
  register property context window in web-content
  (API comunication with IPC or otherwise)
*/

contextBridge.exposeInMainWorld('electronAPI', {
  analysisLinkMangas: ({ info }) => ipcRenderer.send('miru:analysis-link-mangas', { info }),
  downloadLinkMangas: ({ links }) => ipcRenderer.send('miru:donwload-link-mangas', { links }),
  savePathStorage: (callback) => ipcRenderer.on('miru:save--path-storage', callback),
  appendTask: (callback) => ipcRenderer.on('miru:update-task', callback),
  popupChooseFloder: (options) => ipcRenderer.send('miru:choose-path-save', options),
});
