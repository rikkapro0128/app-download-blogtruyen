import miruSend from './sends.js'; // class list send to IPC (main process)

const eleFillPathSave = document.querySelector('.save--location__path--present > span.content');

export default function () {
  // function register event send by main process

  window.electronAPI.savePathStorage((event, value) => {
    if (value.pathStorage !== localStorage.getItem('pathStorage')) {
      localStorage.setItem('pathStorageNew', value.pathStorage);
      eleFillPathSave.innerHTML = value.pathStorage;
    }
  });
}

export { miruSend };
