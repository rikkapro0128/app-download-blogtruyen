import event, { miruSend } from './event';
// import toast from './toasts';
import { Notyf } from 'notyf';

const notyf = new Notyf({
  duration: 1000,
  position: {
    x: 'right',
    y: 'top',
  },
  types: [
    {
      type: 'warning',
      background: 'orange',
      icon: {
        className: 'material-icons',
        tagName: 'i',
        text: 'warning',
      },
    },
    {
      type: 'error',
      background: 'indianred',
      duration: 5000,
      dismissible: true,
    },
  ],
});

document.addEventListener('DOMContentLoaded', function () {
  const eleLink = document.getElementById('link--image');
  const eleBtnDownload = document.getElementById('btn--download');

  event();

  eleBtnDownload.addEventListener('click', function () {
    const url = eleLink.value;
    const testParternUrl = /http[s]?:\/\/blogtruyen.vn/g.test(url);
    if (url) {
      if (testParternUrl) {
        miruSend.linkToIPC(url);
      }
      notyf.error('Link is Invalid!');
    }
  });
});
