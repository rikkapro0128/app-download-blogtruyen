import toast from './toasts/web';
// import toast from './toasts/win';
import { tooltipInit } from './tooltip';
import event, { miruSend } from './event';
import {
  initSelect,
  openSetting,
  closeSetting,
  addAnimation,
  addStyleSmooth,
  initRangeClone,
  appendFormLink,
  removeAnimation,
  initAddressForm,
  analysisMangaList,
  toggleClassBindElement,
  addEventClearContentInput,
} from './utils';

document.addEventListener('DOMContentLoaded', async function () {
  // AREA ELEMENT ADD MORE LINK
  const eleBtnAnalysis = document.querySelector('.analysis--manga');

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

  // AREA ELEMENT CONTROL DOWNLOAD
  // const eleBtnDownload = document.getElementById('btn--download');

  // AREA ELEMENT FORM DEFAULT
  const formDefault = document.querySelector('.form-control');

  eleBtnAnalysis.addEventListener('click', async function () {
    if (!this.className.includes('active')) {
      this.classList.add('active');
      if (this.className.includes('analysis--manga')) {
        analysisMangaList({ elements: document.querySelectorAll('.form-control'), btn: this });
        await addAnimation({ element: this, animationName: 'zoomInSideTop', timeSet: 400 });
        this.innerText = 'download all';
        await addAnimation({ element: this, animationName: 'zoomOutSideBottom', timeSet: 400 });
        this.classList.remove('analysis--manga');
        this.classList.add('downloads--manga', 'disable');
      } else if (this.className.includes('downloads--manga')) {
        if (this.className.includes('disable')) {
          toast.error('You must wait analysis done!');
        }
      }
      removeAnimation({ element: this });
      this.classList.remove('active');
    }
  });

  eleBtnAddlink.addEventListener('click', async function (event) {
    if (!this.className.includes('running')) {
      this.classList.add('running'); // toggle flag
      const btnCheckIsDownload = document.querySelector('.btn.func--btn');
      if (btnCheckIsDownload.className.includes('downloads--manga')) {
        btnCheckIsDownload.classList.remove('downloads--manga', 'disable');
        btnCheckIsDownload.classList.add('analysis--manga');
        btnCheckIsDownload.innerText = 'analysis manga';
      }
      addAnimation({ element: this, animationName: 'fadeOut', timeSet: 0 });
      // block set width to smooth animation
      const parent = this.parentNode;
      const value = parent.offsetHeight + 50;
      parent.style.height = `${value}px`;

      const nodeAfterAppend = await appendFormLink({ element: parent });
      initAddressForm({ elementForm: nodeAfterAppend });
      initSelect({ element: nodeAfterAppend.querySelector('.select') });
      initRangeClone({ formOptions: nodeAfterAppend.querySelector('.form-control__options') });
      nodeAfterAppend.style.height = nodeAfterAppend.querySelector('.form-control__wrap--top').offsetHeight + 'px';
      addEventClearContentInput({
        elementLink: nodeAfterAppend.querySelector('.link--image'),
        elementClear: nodeAfterAppend.querySelector('.form-control__wrap--top__input--clear'),
      });
      addAnimation({ element: this, animationName: 'fadeIn', timeSet: 200 });
      nodeAfterAppend
        .querySelector('.form-control__wrap--top__clear-fill')
        .addEventListener('click', async function () {
          const eleParent = this.closest('.interactive');
          if (!eleParent.className.includes('running')) {
            eleParent.classList.add('running'); // toggle flag

            const getHeightFormControl = this.closest('.form-control').offsetHeight + 10;
            const eleOptions = nodeAfterAppend.querySelector('.form-control__options');
            const value = eleParent.offsetHeight - getHeightFormControl;
            removeAnimation({ element: eleOptions });
            eleOptions.style.display = 'none';
            await addAnimation({
              element: nodeAfterAppend,
              animationName: 'fadeOutZoom',
              timeSet: 300,
            });
            eleParent.style.height = `${value}px`;
            nodeAfterAppend.remove();
            setTimeout(() => {
              // wait for transition default by 200ms
              eleParent.classList.remove('running'); // toggle flag
            }, 200);
          }
        });

      nodeAfterAppend.querySelector('.form-control__wrap--top__setting').addEventListener('click', function (event) {
        if (!this.className.includes('disable')) {
          toggleClassBindElement({ element: event.target, cbActive: openSetting, cbNoActive: closeSetting });
        }
      });

      this.classList.remove('running'); // toggle flag
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
    removeAnimation({ element: elePopupSetting });
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
      removeAnimation({ element: elePopupSetting });
      popupElement.style.display = 'none';
    });
  });

  elePopupSetting.addEventListener('click', async function (event) {
    const popupName = this.className.split(' ')[1];
    if (popupName) {
      const popupElement = elePopupSetting.querySelector(`.save--${popupName}`);
      this.classList.remove(popupName);
      await addAnimation({ element: this, animationName: 'fadeOut', timeSet: 400 });
      removeAnimation({ element: this });
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
  //       removeAnimation({ element: eleInteract });
  //       removeAnimation({ element: eleWelcome });
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
    // removeAnimation({ element: eleMenuSetting });
  });

  eleExitMenuSetting.addEventListener('click', async function (event) {
    event.stopPropagation();
    await addAnimation({ element: eleMenuSetting, animationName: 'fadeOutVeriticalToTop', timeSet: 200 }).then(
      (element) => (element.style.display = 'none'),
    );
    // removeAnimation({ element: eleMenuSetting });
    await addAnimation({ element: eleNodeSetting, animationName: 'outstanding', timeSet: 200 });
    // removeAnimation({ element: eleNodeSetting });
  });

  // deflaut run this code below when content load
  event(); // init many event when main process sending
  tooltipInit(); // options for every tooltip setting
  document
    .querySelector('.form-control.default .form-control__wrap--top__setting')
    .addEventListener('click', async function () {
      if (!this.className.includes('disable')) {
        await toggleClassBindElement({ element: this, cbActive: openSetting, cbNoActive: closeSetting });
      }
    });
  addEventClearContentInput({ elementLink: eleLink, elementClear: eleClearInput }); // add event element clear content input for (link-input)
  // deflaut animation run below when content load
  await addAnimation({ element: eleInteract, animationName: 'fadeInVeriticalToTop', timeSet: 400 });
  removeAnimation({ element: eleInteract, justAnimation: true });

  await addAnimation({ element: eleWelcome, animationName: 'fadeInVeriticalToTop', timeSet: 400 });

  formDefault.style.height = document.querySelector('.form-control__wrap--top').offsetHeight + 'px';
  initAddressForm({ elementForm: formDefault });
  initSelect({ element: formDefault.querySelector('.select') });
  initRangeClone({ formOptions: formDefault.querySelector('.form-control__options') });
});
