import toast from '../toasts/web';
import send from '../event/sends.js';

export async function analysisMangaList({ elements, btn }) {
  let permitSend = true;
  let temp = new Array();
  let countError = 0;

  for (const element of elements) {
    if (element.className.includes('analysed')) {
      continue;
    }
    if (element.className.includes('valid')) {
      element.classList.remove('valid');
    }
    const linkManga = element.querySelector('input.link--image').value;

    if (/http[s]?:\/\/blogtruyen.vn/g.test(linkManga)) {
      if (element.className.includes('error')) {
        element.classList.remove('error');
      }

      element.classList.add('valid');
      temp.push({
        linkManga,
        addressForm: element.getAttribute('form-address'),
      });
    } else {
      if (element.className.includes('valid')) {
        element.classList.remove('valid');
      }
      element.classList.add('error');
      countError += 1;
      permitSend = false;
    }
  }

  if (permitSend) {
    send.analysisLinkMangas({ info: temp, btn });
    await addAnimation({ element: btn, animationName: 'zoomInSideTop', timeSet: 400 });
    btn.innerText = 'download all';
    await addAnimation({ element: btn, animationName: 'zoomOutSideBottom', timeSet: 400 });
    btn.classList.remove('analysis--manga');
    btn.classList.add('downloads--manga', 'disable');
    removeAnimation({ element: btn });
  } else {
    toast.error(`${countError} form link is invalid`);
    const btnCheckIsDownload = document.querySelector('.btn.func--btn');
    if (btnCheckIsDownload.className.includes('downloads--manga')) {
      btnCheckIsDownload.classList.remove('downloads--manga', 'disable');
      btnCheckIsDownload.classList.add('analysis--manga');
      btnCheckIsDownload.innerText = 'analysis manga';
    }
  }
}

export async function addInfoToModal({ modal, address }) {
  const infoManga = getInfoManga({ address });
  if (infoManga) {
    console.log(infoManga);
    const name = modal.querySelector('.wrap--info__desc--name');
    const timeUpdate = modal.querySelector('.wrap--info__desc--time.update > .data');
    const timeCreate = modal.querySelector('.wrap--info__desc--time.create > .data');
    const nameOther = modal.querySelectorAll('.wrap--info__desc--name-other > span');
    const nameAuthor = modal.querySelectorAll('.wrap--info__desc--name-author > span');
    const source = modal.querySelectorAll('.wrap--info__desc--source > span');
    const teamTranslate = modal.querySelectorAll('.wrap--info__desc--team-translate > span');
    const postBy = modal.querySelectorAll('.wrap--info__desc--post-info > span');
    name.innerText = infoManga.name;
    timeCreate.innerText = infoManga.create_date;
    timeUpdate.innerText = infoManga.create_date;
    infoManga.nameOther?.forEach((name) => {
      nameOther[0].parentNode.innerHTML += `<span>${name}</span>`;
    }) || (nameOther[0].parentNode.innerHTML += `<span>Updating...</span>`);
    nameOther.forEach((ele) => ele.remove());
  }
  console.log(infoManga);
}

export function initModalInfo({ element, modal }) {
  const btnViewDetail = element.querySelector('.wrap--info--details > button');
  const btnCloseModal = modal.querySelector('.close--modal');
  const addressForm = element.getAttribute('form-address');
  btnViewDetail.addEventListener('click', async function () {
    if (!this.className.includes('running')) {
      this.classList.add('running');
      await addInfoToModal({ modal, address: addressForm });
      await addAnimation({ element: modal, animationName: 'fadeIn', hasDisplay: 200 });
      this.classList.remove('running');
    }
  });
  btnCloseModal.addEventListener('click', async function () {
    if (!this.className.includes('running')) {
      this.classList.add('running');
      await addAnimation({ element: modal, animationName: 'fadeOut', hasDisplay: 200 });
      removeAnimation({ element: modal });
      this.classList.remove('running');
    }
  });
}

export function initRangeClone({ formOptions }) {
  // element button
  const eleStartCloneReduce = formOptions.querySelector('.wrap--insert--number.start .fill--number__reduce');
  const eleStartCloneUp = formOptions.querySelector('.wrap--insert--number.start .fill--number__increase');
  const eleEndCloneReduce = formOptions.querySelector('.wrap--insert--number.end .fill--number__reduce');
  const eleEndCloneUp = formOptions.querySelector('.wrap--insert--number.end .fill--number__increase');

  // init value reduce & up value
  const eleStartValue = formOptions.querySelector('.wrap--insert--number.start .fill--number__show--number'); // this element INPUT
  const eleEndValue = formOptions.querySelector('.wrap--insert--number.end .fill--number__show--number'); // this element INPUT

  const eleStartTitle = formOptions.querySelector('.wrap--insert--number.start .insert--number__title--custom'); // this element TITLE
  const eleEndTitle = formOptions.querySelector('.wrap--insert--number.end .insert--number__title--custom'); // this element TITLE

  let range = parseInt(formOptions.getAttribute('range'));
  let paternTitle = `${0} - ${range}`;

  const observer = new MutationObserver(function (mutationList) {
    mutationList.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'range') {
        range = parseInt(mutation.target.getAttribute(mutation.attributeName));
        paternTitle = `${0} - ${range}`;
        eleStartTitle.innerText = paternTitle;
        eleEndTitle.innerText = paternTitle;
      }
    });
  });
  observer.observe(formOptions, { attributes: true });
  if (range) {
    eleStartValue.value = 0;
    eleEndValue.value = range;

    eleStartTitle.innerText = paternTitle;
    eleEndTitle.innerText = paternTitle;
    // when change input
    eleStartValue.addEventListener('input', function () {
      const numberStartPresent = parseInt(eleStartValue.value);
      const numberEndPresent = parseInt(eleEndValue.value);
      if (isNaN(numberStartPresent) || isNaN(numberEndPresent)) {
        if (eleStartValue.value !== '') {
          toast.error('Value not number!');
        }
        this.value = 0;
      } else if (!(numberStartPresent < numberEndPresent)) {
        toast.error('Start-clone must be less End-clone!');
        this.value = 0;
      }
    });
    // when change input
    eleEndValue.addEventListener('input', function () {
      const numberStartPresent = parseInt(eleStartValue.value);
      const numberEndPresent = parseInt(eleEndValue.value);
      if (isNaN(numberStartPresent) || isNaN(numberEndPresent)) {
        if (eleEndValue.value !== '') {
          toast.error('Value not number!');
          this.value = 0;
        }
      } else if (!(numberEndPresent > numberStartPresent)) {
        toast.error('End-clone must be bigger Start-clone!');
        this.value = range;
      } else if (numberEndPresent > range) {
        toast.error('End-clone must be less Range!');
        this.value = range;
      }
    });

    eleStartCloneReduce.addEventListener('click', function () {
      const numberStartPresent = parseInt(eleStartValue.value);
      if (numberStartPresent > 0) {
        eleStartValue.value = numberStartPresent - 1;
      }
    });
    // start clone increase number
    eleStartCloneUp.addEventListener('click', function () {
      const numberStartPresent = parseInt(eleStartValue.value);
      const numberEndPresent = parseInt(eleEndValue.value);
      if (numberStartPresent < range && numberStartPresent + 1 < numberEndPresent) {
        eleStartValue.value = numberStartPresent + 1;
      }
    });
    // end clone reduce number
    eleEndCloneReduce.addEventListener('click', function () {
      const numberStartPresent = parseInt(eleStartValue.value);
      const numberEndPresent = parseInt(eleEndValue.value);
      if (numberEndPresent > 0 && numberStartPresent + 1 < numberEndPresent) {
        eleEndValue.value = numberEndPresent - 1;
      }
    });
    // end clone increase number
    eleEndCloneUp.addEventListener('click', function () {
      const numberEndPresent = parseInt(eleEndValue.value);
      if (numberEndPresent < range) {
        eleEndValue.value = numberEndPresent + 1;
      }
    });
  }
}

export function initAddressForm({ elementForm }) {
  let timestamp = Math.round(Date.now() % 10000000);
  elementForm.setAttribute('form-address', timestamp);
}

export function initSelect({ element }) {
  const eleContentSelected = element.querySelector('.select--show__content');
  const subPanel = element.querySelector('.select--panel');
  const ctx = element;

  subPanel.addEventListener('click', function (event) {
    event.stopPropagation();
  }); // disable sub-panel event propagation outside

  element.querySelectorAll('.select--panel__item').forEach((element, index) => {
    element.setAttribute('index-data', index + 1);

    if (element.getAttribute('selected') === '') {
      ctx.setAttribute('select-index', index + 1);
      eleContentSelected.innerText = element.textContent;
    }

    element.addEventListener('click', function () {
      const value = this.textContent;
      const selectedIndex = ctx.getAttribute('select-index');
      if (eleContentSelected.textContent !== value) {
        eleContentSelected.innerText = value;
        ctx.querySelector(`.select--panel__item[index-data='${selectedIndex}']`).removeAttribute('selected');
        ctx.setAttribute('select-index', this.getAttribute('index-data'));
        this.setAttribute('selected', '');
      }
    });
  });

  element.addEventListener('click', async function () {
    if (!this.className.includes('running')) {
      this.classList.add('running');

      if (this.className.includes('active')) {
        await addAnimation({ element: subPanel, animationName: 'fadeOutZoom', timeSet: 200 });
        removeAnimation({ element: subPanel });
        subPanel.style.display = 'none';
        this.classList.remove('active');
      } else {
        await addAnimation({ element: subPanel, animationName: 'fadeInZoom', timeSet: 200 });
        this.classList.add('active');
        document.body.addEventListener('click', outsideClick);
        function outsideClick(event) {
          if (!event.target.closest('.select--panel')) {
            document.body.removeEventListener('click', outsideClick);
            element.click();
          }
        }
      }

      this.classList.remove('running');
    }
  });
}

export function createElementTask({ taskName = 'No task name', isFirst }) {
  const nodeMain = document.createElement('div');
  nodeMain.classList.add('tasks--complete__wrap');
  if (isFirst) {
    nodeMain.classList.add('first');
  }
  nodeMain.innerHTML = `
    <span class="tasks--complete__wrap--tick"></span>
    <h4 class="tasks--complete__wrap--name">${taskName}</h4>
  `;
  return nodeMain;
}

export function getComputedStyle(element, style = 'color') {
  // get style by element
  return window.getComputedStyle(element, null).getPropertyValue(style);
}

export async function appendTaskByName({ elementAppend, taskName }) {
  const checkIsFirst = elementAppend.querySelector('.tasks--complete__wrap.first'); // check is first task
  const createNodeTask = createElementTask({ taskName: taskName, isFirst: checkIsFirst ? false : true });
  if (checkIsFirst) {
    await addClassForAnimation({ className: 'sideVertical', element: createNodeTask });
  } else {
    await addClassForAnimation({ className: 'fade-in-veritical-to-top', element: elementAppend });
  }
  createNodeTask.classList.add('active');
  elementAppend.append(createNodeTask);
  return Promise.resolve(createNodeTask);
}

export function addClassForAnimation({ className, element, timeSet = 600 }) {
  element.classList.add(className);
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, timeSet);
  });
}

export function addAnimation({ element, animationName, timeSet = 600, hasDisplay = true }) {
  return new Promise((res) => {
    // element.addEventListener('animationstart', function () { console.log('start animation!'); res(element) });
    element.addEventListener(
      'animationend',
      function () {
        res(element);
      },
      false,
    );
    element.setAttribute(
      'style',
      `
      ${hasDisplay ? 'display: block;' : ''}
      animation: ${animationName} ${timeSet}ms ease-in-out forwards;
    `,
    );
  });
}

export function addStyleSmooth({ element, propStyle, delay = 5, timeSet = 400 }) {
  return new Promise((res) => {
    element.setAttribute(
      'style',
      `
        display: block;
        transition: all ${timeSet - delay}ms ease-in-out;
      `,
    );
    setTimeout(() => {
      element.style[propStyle.prop] = propStyle.value;
      res(element);
    }, delay);
  });
}

export function removeAnimation({ element, justAnimation = false }) {
  if (justAnimation) {
    element.setAttribute('style', 'display: block;');
  } else {
    element.setAttribute('style', '');
  }
}

export function addEventClearContentInput({ elementLink, elementClear }) {
  let modified = false;
  const formParent = elementLink.closest('.form-control');

  function changeStatusBtn(cb) {
    const btnCheckIsDownload = document.querySelector('.btn.func--btn');
    if (btnCheckIsDownload.className.includes('downloads--manga')) {
      cb(btnCheckIsDownload);
    }
    if (formParent.className.includes('valid')) {
      formParent.classList.remove('valid');
    }
  }

  function runChangeState(btnChecked) {
    btnChecked.classList.remove('downloads--manga', 'disable');
    btnChecked.classList.add('analysis--manga');
    btnChecked.innerText = 'analysis manga';
  }

  elementClear.addEventListener('click', function () {
    elementLink.value = '';
    modified = true;
    elementLink.focus();
    changeStatusBtn(runChangeState);
  });

  elementLink.addEventListener('focusin', function () {
    if (this.value && !elementClear.className.includes('active')) {
      elementClear.classList.add('active');
    }
  });

  elementLink.addEventListener('input', function () {
    const val = this.value;
    if (elementClear.className.includes('disable') && val) elementClear.classList.remove('disable');
    if (val && !elementClear.className.includes('active')) {
      elementClear.classList.add('active');
    } else if (!val) {
      elementClear.classList.remove('active');
    }
    modified = true;
    changeStatusBtn(runChangeState);
  });

  elementLink.addEventListener('focusout', function () {
    const val = this.value;
    if (val && modified) {
      send.clearThisMangaByAddress({
        address: elementLink.closest('.form-control').getAttribute('form-address'),
        type: 'INPUT_CHANGE',
      });
      modified = false;
    }
    if (elementClear.className.includes('active')) {
      elementClear.classList.remove('active');
    }
  });
}

export async function appendFormLink({ element }) {
  const mission = document.createElement('div');
  mission.classList.add('form-control');
  mission.innerHTML = `
  <div class="form-control__wrap--top">
    <!-- input link clone manga -->
    <div class="form-control__wrap--top__input">
      <input spellcheck="false" class="link--image form-control__wrap--top__input--fill"
        value="https://blogtruyen.vn/25863/vi-tieu-thu-healer-hang-e" type="text" placeholder="Link manga..." />
      <span class="form-control__wrap--top__input--clear material-symbols-outlined">backspace</span>
    </div>
    <!-- button to clear container input link -->
    <button class="form-control__wrap--top__clear-fill btn btn--primary">
      <span class="material-symbols-outlined"> remove </span>
    </button>
    <!-- button to open setting clone -->
    <button class="form-control__wrap--top__setting disable btn btn--primary">
      <span class="material-symbols-outlined"> settings </span>
    </button>
  </div>
  <div range="10" class="form-control__options">
    <!-- component insert number -->
    <div class="wrap--insert--number start">
      <div class="insert--number">
        <h3 class="insert--number__title">
          Start chapter
          <span class="insert--number__title--custom">? - ?</span>
        </h3>
      </div>
      <div class="fill--number">
        <div class="fill--number__reduce">
          <span class="material-symbols-outlined"> remove </span>
        </div>
        <div class="fill--number__show">
          <input class="fill--number__show--number" value="?" />
        </div>
        <div class="fill--number__increase">
          <span class="material-symbols-outlined"> add </span>
        </div>
      </div>
    </div>
    <!-- component insert number -->
    <div class="wrap--insert--number end">
      <div class="insert--number">
        <h3 class="insert--number__title">
          End chapter
          <span class="insert--number__title--custom">? - ?</span>
        </h3>
      </div>
      <div class="fill--number">
        <div class="fill--number__reduce">
          <span class="material-symbols-outlined"> remove </span>
        </div>
        <div class="fill--number__show">
          <input class="fill--number__show--number" value="?" />
        </div>
        <div class="fill--number__increase">
          <span class="material-symbols-outlined"> add </span>
        </div>
      </div>
    </div>
    <!-- component select output clone -->
    <div class="wrap--select--output">
      <div class="select--output">
        <h3 class="select--output__title">Type output</h3>
      </div>
      <!-- component select output clone -->
      <div class="select">
        <div class="select--show">
          <span class="select--show__content"></span>
          <div class="select--show__icon">
            <svg data-v-e3e1e202="" aria-hidden="true" focusable="false" data-prefix="fas"
              data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
              class="icon svg-inline--fa fa-chevron-down fa-w-14 fa-fw">
              <path data-v-e3e1e202="" fill="currentColor"
                d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                class=""></path>
            </svg>
          </div>
        </div>
        <div class="select--panel">
          <div class="select--panel__item" selected data-set="directory">Directory</div>
          <div class="select--panel__item" data-set="pdf">PDF</div>
        </div>
      </div>
    </div>
    <!-- component view more information -->
    <div class="wrap--info--details">
      <h3 class="wrap--info--details__title">
        View more
      </h3>
      <button class="btn btn--primary">
        <span class="material-symbols-outlined">
          more_horiz
        </span>
      </button>
    </div>
  </div>
  `;
  element.insertBefore(mission, element.lastElementChild);
  await addAnimation({ element: mission, animationName: 'fadeInZoom', timeSet: 400, hasDisplay: false });
  removeAnimation({ element: mission, justAnimation: true });

  return Promise.resolve(mission);
}

export async function toggleClassBindElement({
  element,
  className = 'active',
  cbActive = undefined,
  cbNoActive = undefined,
}) {
  if (element.className.includes(className) && !element.className.includes('running')) {
    element.classList.add('running');

    element.classList.remove(className);
    if (typeof cbNoActive === 'function') {
      await cbNoActive({ eleBtnSetting: element, margin: 10 });
    }

    element.classList.remove('running');
  } else if (!element.className.includes(className) && !element.className.includes('running')) {
    element.classList.add('running');

    element.classList.add(className);
    if (typeof cbActive === 'function') {
      await cbActive({ eleBtnSetting: element, margin: 10 });
    }

    element.classList.remove('running');
  }
}

export async function openSetting({ eleBtnSetting, margin = 0, timeSet = 200 }) {
  const parent = eleBtnSetting.closest('.form-control');
  const eleInteractive = parent.parentNode;
  const eleOptions = parent.querySelector('.form-control__options');
  const heightOption = getHeightWhenDisplayNone({ element: eleOptions }) + margin;
  parent.style.height = `${eleBtnSetting.offsetHeight + heightOption}px`;
  eleInteractive.style.height = `${eleInteractive.offsetHeight + heightOption}px`;
  await addAnimation({ element: eleOptions, animationName: 'fadeInZoom', timeSet: 200 });
  removeAnimation({ element: eleOptions, justAnimation: true });
}

export async function closeSetting({ eleBtnSetting, margin = 0, timeSet = 200 }) {
  const parent = eleBtnSetting.closest('.form-control');
  const eleInteractive = parent.parentNode;
  const eleOptions = parent.querySelector('.form-control__options');
  const heightOption = getHeightWhenDisplayNone({ element: eleOptions }) + margin;
  parent.style.height = `${eleBtnSetting.offsetHeight}px`;
  eleInteractive.style.height = `${eleInteractive.offsetHeight - heightOption}px`;
  await addAnimation({
    element: eleOptions,
    animationName: 'fadeOutZoom',
    timeSet: 200,
  });
  removeAnimation({ element: eleOptions });
}

export function getHeightWhenDisplayNone({ element, customDisplay = undefined }) {
  let height = 0;
  element.style.opacity = 0;
  element.style.display = customDisplay ? customDisplay : 'block';
  height = element.offsetHeight;
  element.style.opacity = 1;
  element.style.display = 'none';
  return height;
}
