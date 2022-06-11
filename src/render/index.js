import event, { miruSend } from './event';
import toast from './toasts/web';
import { createTask, addClassForAnimation } from './utils';
// import toast from './toasts/win';

document.addEventListener('DOMContentLoaded', async function () {
  const eleLink = document.getElementById('link--image');
  const eleClearInput = document.querySelector('.form--wrap__clear');
  const eleTaskComplete = document.querySelector('.tasks--complete');
  const eleTotalTaskComplete = document.querySelector('.total-task--complete');
  const eleProgressBar = document.querySelector('.progress-bar');
  const eleBtnDownload = document.getElementById('btn--download');

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

  event();
  let totalTasks = 0;

  await addClassForAnimation({ className: 'active', element: eleProgressBar });

  const idRunningTask = setInterval(async () => {
    const checkIsFirst = eleTaskComplete.querySelector('.tasks--complete__wrap.first');
    const nodeTask = createTask({ taskName: 'No name task', isFirst: checkIsFirst ? false : true });
    if (checkIsFirst) {
      await addClassForAnimation({ className: 'sideVertical', element: nodeTask });
    } else {
      await addClassForAnimation({ className: 'active', element: eleTaskComplete });
    }
    nodeTask.classList.add('active');
    eleTaskComplete.append(nodeTask);
    totalTasks += 1;
    if (totalTasks === 5) {
      clearInterval(idRunningTask);
      setTimeout(async () => {
        await addClassForAnimation({ className: 'active', element: eleTotalTaskComplete });
      }, 1000);
    }
  }, 1000);
});
