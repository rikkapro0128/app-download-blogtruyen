class send {
  analysisLinkMangas({ info }) {
    /*
      send link to IPC (main process)
    */
    window.electronAPI.analysisLinkMangas({ info });
  }

  downloadLinkMangas({ links }) {
    /*
      send link to IPC (main process)
    */
    window.electronAPI.downloadLinkMangas({ links });
  }
  clearThisMangaByAddress(props) {
    /*
      send link to IPC (main process)
    */
    window.clearThisMangaByAddress(props);
  }
}

export default new send();
