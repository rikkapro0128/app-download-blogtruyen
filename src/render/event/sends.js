class send {
  linkToIPC(url) {
    /*
      send link to IPC (main process)
    */
    window.electronAPI.sendLinkManga(url);
  }
}

export default new send();
