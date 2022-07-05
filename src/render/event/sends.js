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
  clearThisMangaByAddress({ address }) {
    /*
      send link to IPC (main process)
    */
    window.clearThisMangaByAddress({ address });
  }
}

export default new send();
