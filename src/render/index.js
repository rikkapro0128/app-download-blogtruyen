import event, { miruSend } from './event';
import toast from './toasts/web';
import { addClassForAnimation, appendTaskByName, addAnimation, removeAnimation, getComputedStyle } from './utils';
// import toast from './toasts/win';

document.addEventListener('DOMContentLoaded', async function () {
  const eleLink = document.getElementById('link--image');
  const eleInteract = document.querySelector('.interactive');
  const eleClearInput = document.querySelector('.form--wrap__clear');
  const eleTaskComplete = document.querySelector('.tasks--complete');
  const eleExitMenuSetting = document.querySelector('.menu__select--item.exit');
  const eleNodeSetting = document.querySelector('.node--setting');
  const eleMenuSetting = document.querySelector('.menu__select');
  const eleWelcome = document.querySelector('.welcome');
  const eleTotalTaskComplete = document.querySelector('.total-task--complete');
  const eleProgressBar = document.querySelector('.progress-bar');
  const eleWrap = document.querySelector('html');
  const eleBtnDownload = document.getElementById('btn--download');

  eleBtnDownload.addEventListener('click', async function () {
    const url = eleLink.value;
    const testParternUrl = /http[s]?:\/\/blogtruyen.vn/g.test(url);
    if (url) {
      if (testParternUrl) {
        miruSend.linkToIPC(url);
        // toast.success('Processing download...!');
        await addAnimation({ element: eleInteract, animationName: 'fadeOutVeriticalToTop', timeSet: 400 });
        await removeAnimation({ element: eleInteract });
        await removeAnimation({ element: eleWelcome, justAnimation: true });
        await addAnimation({ element: eleWelcome, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
        await addAnimation({ element: eleProgressBar, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
        await addAnimation({ element: eleTaskComplete, animationName: 'fadeInVeriticalToTop', timeSet: 400 });

        const idRunningTask = setInterval(async () => {
          const taskAppended = await appendTaskByName({ elementAppend: eleTaskComplete, taskName: 'no task name' });
          const getWidthElementWrap = getComputedStyle(eleWrap, 'height').split('px')[0];
          // const getWidthTask = getComputedStyle(taskAppended, 'height').split('px')[0];
          eleWrap.scrollTop = getWidthElementWrap;
          totalTasks += 1;
          if (totalTasks === 10) {
            clearInterval(idRunningTask);
          }
        }, 1000);
      } else {
        toast.error('Link is Invalid!');
      }
    } else {
      toast.error('Link not found!');
    }
  });

  eleNodeSetting.addEventListener('click', async function () {
    await addAnimation({ element: eleNodeSetting, animationName: 'hideDeep', timeSet: 200 });
    await addAnimation({ element: eleMenuSetting, animationName: 'fadeInVeriticalToTop', timeSet: 200 });
  });

  eleExitMenuSetting.addEventListener('click', async function (event) {
    event.stopPropagation();
    await addAnimation({ element: eleMenuSetting, animationName: 'fadeOutVeriticalToTop', timeSet: 200 }).then(
      (element) => (element.style.display = 'none'),
    );
    await addAnimation({ element: eleNodeSetting, animationName: 'outstanding', timeSet: 200 });
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

  await addAnimation({ element: eleInteract, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
  await addAnimation({ element: eleWelcome, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
});
