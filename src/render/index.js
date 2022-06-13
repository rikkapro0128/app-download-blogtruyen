import event, { miruSend } from './event';
import toast from './toasts/web';
import {
  addClassForAnimation,
  appendTaskByName,
  addAnimation,
  removeAnimation,
  getComputedStyle,
  addStyleSmooth,
} from './utils';
// import toast from './toasts/win';

document.addEventListener('DOMContentLoaded', async function () {
  const eleLink = document.getElementById('link--image');
  const eleInteract = document.querySelector('.interactive');
  const eleClearInput = document.querySelector('.form--wrap__clear');
  const eleTaskComplete = document.querySelector('.tasks--complete');
  const eleExitMenuSetting = document.querySelector('.menu__select--item.exit');
  const eleLocationMenuSetting = document.querySelector('.menu__select--item.location');
  const eleNodeSetting = document.querySelector('.node--setting');
  const eleMenuSetting = document.querySelector('.menu__select');
  const eleWelcome = document.querySelector('.welcome--no-tasks');
  const eleWelcomeTaskRunning = document.querySelector('.welcome--task-running');
  const eleTotalTaskComplete = document.querySelector('.total-task--complete');
  const eleProgressBar = document.querySelector('.progress-bar');
  const eleWrap = document.querySelector('html');
  const eleControlPause = document.querySelector('.control--download__pause');
  const eleControlStop = document.querySelector('.control--download__stop');
  const elePopupSetting = document.querySelector('.popup--setting');
  const eleSaveLocation = document.querySelector('.save--location');
  const eleChoosePathSave = eleSaveLocation.querySelector('.save--location__area--click');
  const eleSaveLocationClose = eleSaveLocation.querySelector('.save--location__close > span');
  const eleFillPathSave = eleSaveLocation.querySelector('.save--location__path--present > span.content');
  const eleBtnSavePath = eleSaveLocation.querySelector('.save--location__save.btn');
  const eleBtnDownload = document.getElementById('btn--download');

  eleBtnSavePath.addEventListener('click', async function () {
    const pathIsNew = localStorage.getItem('pathStorageNew');
    if (pathIsNew) {
      localStorage.setItem('pathStorage', pathIsNew);
      localStorage.removeItem('pathStorageNew');
      toast.success('Path is saved!');
    } else {
      toast.open({ type: 'warning', message: 'Not change!' });
    }
    await addAnimation({ element: elePopupSetting, animationName: 'fadeOut', timeSet: 400 });
    await removeAnimation({ element: elePopupSetting });
  });

  eleChoosePathSave.addEventListener('click', function () {
    window.electronAPI.popupChooseFloder();
  });

  eleLocationMenuSetting.addEventListener('click', async function () {
    const checkPath = localStorage.getItem('pathStorage');
    if (checkPath) {
      eleFillPathSave.innerHTML = checkPath;
    } else {
      eleFillPathSave.innerHTML = 'not selected yet!';
    }
    await addAnimation({ element: elePopupSetting, animationName: 'fadeIn', timeSet: 400 });
    // load done for animation
  });

  eleSaveLocationClose.addEventListener('click', async function (event) {
    await addAnimation({ element: elePopupSetting, animationName: 'fadeOut', timeSet: 400 });
    await removeAnimation({ element: elePopupSetting });
  });

  eleSaveLocation.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  elePopupSetting.addEventListener('click', async function (event) {
    event.stopPropagation();
    await addAnimation({ element: this, animationName: 'fadeOut', timeSet: 400 });
    await removeAnimation({ element: this });
  });

  eleControlPause.addEventListener('click', function () {
    if (eleControlPause.className.includes('active')) {
      eleControlPause.classList.remove('active');
    } else {
      eleControlPause.classList.add('active');
    }
  });

  eleBtnDownload.addEventListener('click', async function () {
    const url = eleLink.value;
    const testParternUrl = /http[s]?:\/\/blogtruyen.vn/g.test(url);
    if (url) {
      if (testParternUrl) {
        miruSend.linkToIPC(url);
        // toast.success('Processing download...!');
        await addAnimation({ element: eleInteract, animationName: 'fadeOutVeriticalToTop', timeSet: 400 });
        await addAnimation({ element: eleWelcome, animationName: 'welcomeOut', timeSet: 400 });
        await removeAnimation({ element: eleInteract });
        await removeAnimation({ element: eleWelcome });
        await addAnimation({ element: eleWelcomeTaskRunning, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
        await addAnimation({ element: eleControlPause, animationName: 'sideRightToLeft', timeSet: 400 });
        await addAnimation({ element: eleControlStop, animationName: 'sideRightToLeft', timeSet: 400 });
        // await addStyleSmooth({ element: eleWelcome, propStyle: { prop: 'transform', value: 'scale(0.5)' } });
        // await addStyleSmooth({ element: eleWelcome, propStyle: { prop: 'transform', value: 'translateY(-50%)' } });
        // await addAnimation({ element: eleWelcome, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
        await addAnimation({ element: eleProgressBar, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
        await addAnimation({ element: eleTaskComplete, animationName: 'fadeInVeriticalToTop', timeSet: 400 });

        // const idRunningTask = setInterval(async () => {
        //   const taskAppended = await appendTaskByName({ elementAppend: eleTaskComplete, taskName: 'no task name' });
        //   const getWidthElementWrap = getComputedStyle(eleWrap, 'height').split('px')[0];
        //   // const getWidthTask = getComputedStyle(taskAppended, 'height').split('px')[0];
        //   eleWrap.scrollTop = getWidthElementWrap;
        //   totalTasks += 1;
        //   if (totalTasks === 10) {
        //     clearInterval(idRunningTask);
        //   }
        // }, 1000);
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

  await addAnimation({ element: eleInteract, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
  await addAnimation({ element: eleWelcome, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
});
