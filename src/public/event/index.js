import miruSend from './sends.js'; // class list send to IPC (main process)

export default function () {
  // function register event send by main process

  const elePercent = document.getElementById('percent'); // element view percent progress bar

  let countPercent = 0;

  window.electronAPI.handlePercent((event, value) => {
    const oldValue = countPercent;
    const newValue = oldValue + value;
    elePercent.style.width = newValue + '%';
  });
}

export { miruSend };
