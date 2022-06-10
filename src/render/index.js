import event, { miruSend } from './event';
import toast from './toasts/web';
// import toast from './toasts/win';

document.addEventListener('DOMContentLoaded', function () {
  const eleLink = document.getElementById('link--image');
  const eleClearInput = document.querySelector('.form--wrap__clear');
  const eleBtnDownload = document.getElementById('btn--download');

  event();

  eleBtnDownload.addEventListener('click', function () {
    const url = eleLink.value;
    const testParternUrl = /http[s]?:\/\/blogtruyen.vn/g.test(url);
    if (url) {
      if (testParternUrl) {
        miruSend.linkToIPC(url);
      }
      toast.error('Link is Invalid!');
    } else {
      toast.error('Link not found!');
    }
  });

  eleClearInput.addEventListener('click', function () {
    eleLink.value = '';
  });

  eleLink.addEventListener('focusin', function () {
    if (this.value && !eleClearInput.className.includes('active')) {
      eleClearInput.classList.add('active');
    }
  });

  eleLink.addEventListener('input', function () {
    const val = this.value;
    if (val && !eleClearInput.className.includes('active')) {
      eleClearInput.classList.add('active');
    } else if (!val) {
      eleClearInput.classList.remove('active');
    }
  });

  eleLink.addEventListener('focusout', function () {
    if (eleClearInput.className.includes('active')) {
      eleClearInput.classList.remove('active');
    }
  });
});
