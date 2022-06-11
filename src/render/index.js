import event, { miruSend } from './event';
import toast from './toasts/web';
import { createTask } from './utils';
// import toast from './toasts/win';

document.addEventListener('DOMContentLoaded', function () {
  const eleLink = document.getElementById('link--image');
  const eleClearInput = document.querySelector('.form--wrap__clear');
  const eleTaskComplete = document.querySelector('.tasks--complete');
  const eleBtnDownload = document.getElementById('btn--download');

  event();
  let totalTasks = 0;

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

  // const idRunningTask = setInterval(() => {

  //   const checkIsFirst = eleTaskComplete.querySelector('.tasks--complete__wrap.first');
  //   const nodeTask = createTask({ taskName: 'No name task', isFirst: checkIsFirst ? false : true });
  //   if(checkIsFirst) {
  //     nodeTask.classList.add('sideVertical');
  //   }
  //   nodeTask.classList.add('active');
  //   eleTaskComplete.append(nodeTask);
  //   totalTasks += 1;
  //   if(totalTasks === 5) {
  //     clearInterval(idRunningTask);
  //   }

  // }, 1000)

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
