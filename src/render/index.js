import { tooltipInit } from './tooltip';
import toast from './toasts/web';
// import toast from './toasts/win';
import event, { miruSend } from './event';
import {
  openSetting,
  closeSetting,
  addAnimation,
  addStyleSmooth,
  appendFormLink,
  removeAnimation,
  toggleClassBindElement,
  addEventClearContentInput,
} from './utils';

document.addEventListener('DOMContentLoaded', async function () {
  // AREA ELEMENT ADD MORE LINK

  const eleBtnAddlink = document.querySelector('.form--add');

  // AREA ELEMENT INTERACT BODY CONTENT
  const eleLink = document.querySelector('.link--image');
  const eleInteract = document.querySelector('.interactive');
  const eleClearInput = document.querySelector('.form-control__wrap--top__input--clear');
  const eleTaskComplete = document.querySelector('.tasks--complete');
  const eleExitMenuSetting = document.querySelector('.menu__select--item.exit');

  // AREA ELEMENT CONTROL POPUP
  const listSelectMenu = document.querySelectorAll('.menu__select > .menu__select--item:not(.exit)');
  const listPopupBtnClose = document.querySelectorAll('.popup--setting__close > span');
  const elePopupSetting = document.querySelector('.popup--setting');

  // AREA ELEMENT CONTROL DOWNLOAD
  const eleNodeSetting = document.querySelector('.node--setting');
  const eleMenuSetting = document.querySelector('.menu__select');
  const eleWelcome = document.querySelector('.welcome--no-tasks');
  const eleWelcomeTaskRunning = document.querySelector('.welcome--task-running');
  const eleTotalTaskComplete = document.querySelector('.total-task--complete');
  const eleProgressBar = document.querySelector('.progress-bar');

  // ELEMENT WRAP CONTENT
  const eleWrap = document.querySelector('html');

  // DEFINE VARIABLE SCOPE GLOBAL
  let checkAnimationAddLinkDone = true; // true is done and otherwhise

  // AREA MANAGER POPUP ELEMENT
  const elePopupLocation = document.querySelector('.save--location');
  const elePopupOptions = document.querySelector('.save--options');
  const eleBtnSavePath = elePopupLocation.querySelector('.save--location__save');
  const eleChoosePathSave = elePopupLocation.querySelector('.save--location__area--click');

  // AREA ELEMENT CONTROL DOWNLOAD
  const eleControlPause = document.querySelector('.control--download__pause');
  const eleControlStop = document.querySelector('.control--download__stop');
  // const eleBtnDownload = document.getElementById('btn--download');

  eleBtnAddlink.addEventListener('click', async function (event) {
    if (checkAnimationAddLinkDone) {
      checkAnimationAddLinkDone = false; // toggle flag

      addAnimation({ element: this, animationName: 'fadeOut', timeSet: 0 });
      // block set width to smooth animation
      const parent = this.parentNode;
      const value = parent.offsetHeight + 48;
      parent.style.height = `${value}px`;

      const nodeAfterAppend = await appendFormLink({ element: this.parentNode });
      nodeAfterAppend.style.height = nodeAfterAppend.querySelector('.form-control__wrap--top').offsetHeight + 'px';
      addEventClearContentInput({
        elementLink: nodeAfterAppend.querySelector('.link--image'),
        elementClear: nodeAfterAppend.querySelector('.form-control__wrap--top__input--clear'),
      });

      addAnimation({ element: this, animationName: 'fadeIn', timeSet: 200 });
      nodeAfterAppend
        .querySelector('.form-control__wrap--top__clear-fill')
        .addEventListener('click', async function () {
          if (checkAnimationAddLinkDone) {
            checkAnimationAddLinkDone = false; // toggle flag

            const getHeightFormControl = this.closest('.form-control').offsetHeight + 10;
            const value = parent.offsetHeight - getHeightFormControl;
            parent.style.height = `${value}px`;
            await addAnimation({
              element: nodeAfterAppend,
              animationName: 'fadeOutZoom',
              timeSet: 300,
              hasDisplay: false,
            });
            nodeAfterAppend.remove();

            checkAnimationAddLinkDone = true; // toggle flag
          }
        });

      nodeAfterAppend.querySelector('.form-control__wrap--top__setting').addEventListener('click', function (event) {
        if (checkAnimationAddLinkDone) {
          checkAnimationAddLinkDone = false; // toggle flag

          toggleClassBindElement({ element: event.target, cbActive: openSetting, cbNoActive: closeSetting });

          checkAnimationAddLinkDone = true; // toggle flag
        }
      });

      checkAnimationAddLinkDone = true; // toggle flag
    }
  });

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

  listSelectMenu.forEach((element) => {
    element.addEventListener('click', async function (event) {
      const popupName = this.className.split(' ')[1];
      let popupElement = document.querySelector(`.popup--setting > .save--${popupName}`);
      elePopupSetting.classList.add(popupName);
      if (popupName === 'location') {
        const checkPath = localStorage.getItem('pathStorage');
        const eleFillPathSave = popupElement.querySelector('.save--location__path--present .content');
        if (checkPath) {
          eleFillPathSave.innerHTML = checkPath;
        } else {
          eleFillPathSave.innerHTML = 'not selected yet!';
        }
      }
      // load for animation
      popupElement.style.display = 'block';
      await addAnimation({ element: elePopupSetting, animationName: 'fadeIn', timeSet: 400 });
    });
  });

  listPopupBtnClose.forEach((element) => {
    const popupElement = element.closest('.wrap--popup');

    popupElement.addEventListener('click', function (event) {
      event.stopPropagation();
    });

    element.addEventListener('click', async function () {
      elePopupSetting.classList.remove(elePopupSetting.className.split(' ')[1]);
      // load for animation
      await addAnimation({ element: elePopupSetting, animationName: 'fadeOut', timeSet: 400 });
      await removeAnimation({ element: elePopupSetting });
      popupElement.style.display = 'none';
    });
  });

  elePopupSetting.addEventListener('click', async function (event) {
    const popupName = this.className.split(' ')[1];
    if (popupName) {
      const popupElement = elePopupSetting.querySelector(`.save--${popupName}`);
      this.classList.remove(popupName);
      await addAnimation({ element: this, animationName: 'fadeOut', timeSet: 400 });
      await removeAnimation({ element: this });
      popupElement.style.display = 'none';
    }
  });

  eleControlPause.addEventListener('click', function () {
    if (eleControlPause.className.includes('active')) {
      eleControlPause.classList.remove('active');
    } else {
      eleControlPause.classList.add('active');
    }
  });

  // eleBtnDownload.addEventListener('click', async function () {
  //   const url = eleLink.value;
  //   const testParternUrl = /http[s]?:\/\/blogtruyen.vn/g.test(url);
  //   if (url) {
  //     if (testParternUrl) {
  //       await addAnimation({ element: eleInteract, animationName: 'fadeOutVeriticalToTop', timeSet: 400 });
  //       await addAnimation({ element: eleWelcome, animationName: 'welcomeOut', timeSet: 400 });
  //       await removeAnimation({ element: eleInteract });
  //       await removeAnimation({ element: eleWelcome });
  //       await addAnimation({ element: eleWelcomeTaskRunning, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
  //       await addAnimation({ element: eleControlPause, animationName: 'sideRightToLeft', timeSet: 400 });
  //       await addAnimation({ element: eleControlStop, animationName: 'sideRightToLeft', timeSet: 400 });
  //       await addAnimation({ element: eleProgressBar, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
  //       await addAnimation({ element: eleTaskComplete, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
  //       // Wait for animation ended!
  //       miruSend.linkToIPC(url);
  //     } else {
  //       toast.error('Link is Invalid!');
  //     }
  //   } else {
  //     toast.error('Link not found!');
  //   }
  // });

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

  // deflaut run this code below when content load
  event(); // init many event when main process sending
  tooltipInit(); // options for every tooltip setting
  document
    .querySelector('.form-control.default .form-control__wrap--top__setting')
    .addEventListener('click', async function () {
      await toggleClassBindElement({ element: this, cbActive: openSetting, cbNoActive: closeSetting });
    });
  addEventClearContentInput({ elementLink: eleLink, elementClear: eleClearInput }); // add event element clear content input for (link-input)
  // deflaut animation run below when content load
  await addAnimation({ element: eleInteract, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
  await addAnimation({ element: eleWelcome, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
  document.querySelector('.form-control').style.height =
    document.querySelector('.form-control__wrap--top').offsetHeight + 'px';
});
