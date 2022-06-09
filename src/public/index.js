import event, { miruSend } from './event/index.js';

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
    }
  });
});
