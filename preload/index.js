const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  handlePercent: (callback) => ipcRenderer.on('update-percent', callback)
})
