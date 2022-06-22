const { contextBridge, ipcRenderer } = require('electron');

/*
  register property context window in web-content
  (API comunication with IPC or otherwise)
*/

contextBridge.exposeInMainWorld('electronAPI', {
  analysisLinkMangas: ({ info }) => ipcRenderer.send('miru:analysis-link-mangas', { info }),
  downloadLinkMangas: ({ links }) => ipcRenderer.send('miru:donwload-link-mangas', { links }),
  popupChooseFloder: (options) => ipcRenderer.send('miru:choose-path-save', options),
  appendTask: (callback) => ipcRenderer.on('miru:update-task', callback),
  savePathStorage: (callback) => ipcRenderer.on('miru:save--path-storage', callback),
  resultAnalysisManga: (callback) => ipcRenderer.on('miru:result-analysis-manga-links', callback),
});
