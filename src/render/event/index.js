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
    // handle data repsonse from IPC main
    const eleForm = document.querySelector(`.form-control[form-address="${mangaResult.addressForm}"]`);
    eleForm.querySelector('.form-control__options').setAttribute('range', mangaResult.chapters.length);
    eleForm.classList.add('analysed');
  });

  window.electronAPI.doneAnalysisManga((event) => {
    console.log('result', storeAnalysis);
    storeAnalysis.forEach((value, index) => {
      const eleBtn = document.querySelector(
        `.form-control[form-address="${value.addressForm}"] .form-control__wrap--top__setting`,
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

  window.clearThisMangaByAddress = function ({ address, type }) {
    const eleForm = document.querySelector(`.form-control[form-address="${address}"]`);
    eleForm.classList.remove('analysed');
    storeAnalysis = storeAnalysis.filter((value) => value.addressForm !== address);
    console.log('change', storeAnalysis);
  };

  window.getInfoManga = function ({ address }) {
    return storeAnalysis.find((value) => value.addressForm === address);
  };
}

export { miruSend };
