import miruSend from './sends.js'; // class list send to IPC (main process)
import { appendTaskByName } from '../utils/index.js';

const eleWrap = document.querySelector('html');
const eleTaskComplete = document.querySelector('.tasks--complete');
const eleFillPathSave = document.querySelector('.save--location__path--present > span.content');

export default function () {
  // function register event send by main process

  let storeAnalysis = new Array();

  window.electronAPI.savePathStorage((event, value) => {
    if (value.pathStorage !== localStorage.getItem('pathStorage')) {
      localStorage.setItem('pathStorageNew', value.pathStorage);
      eleFillPathSave.innerHTML = value.pathStorage;
    }
  });

  window.electronAPI.appendTask(async (event, { name, type }) => {
    // console.log({ name, type });
    await appendTaskByName({ elementAppend: eleTaskComplete, taskName: name });
    if (eleWrap.scrollHeight > 561) {
      eleWrap.scrollTop = eleWrap.scrollHeight;
    }
  });

  window.electronAPI.resultAnalysisManga((event, { mangaResult }) => {
    storeAnalysis.push(mangaResult);
  });

  window.electronAPI.doneAnalysisManga((event) => {
    console.log(storeAnalysis);
    storeAnalysis.forEach((value, index) => {
      const eleBtn = document.querySelector(
        `.form-control[form-addresss="${value.addressForm}"] .form-control__wrap--top__setting`,
      );
      if (eleBtn) {
        eleBtn.classList.remove('disable');
        eleBtn.classList.add('opening');
      } else {
        storeAnalysis.splice(index, 1);
      }
    });
  });

  window.electronAPI.initStoreAnalysisManga((event) => {
    storeAnalysis = []; // clear store
  });

  window.clearThisMangaByAddress = function ({ address }) {
    console.log(address);
  };
}

export { miruSend };
