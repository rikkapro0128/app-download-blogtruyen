export function initSelect({ element }) {
  const eleContentSelected = element.querySelector('.select--show__content');
  const ctx = element;

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
      const subPanel = this.querySelector('.select--panel');

      if (this.className.includes('active')) {
        await addAnimation({ element: subPanel, animationName: 'fadeOutZoom', timeSet: 200 });
        removeAnimation({ element: subPanel });
        subPanel.style.display = 'none';
        this.classList.remove('active');
      } else {
        await addAnimation({ element: subPanel, animationName: 'fadeInZoom', timeSet: 200 });
        this.classList.add('active');
        document.body.addEventListener('click', outsideClick);
        function outsideClick() {
          console.log('click outside!'); // test
          if (element.className.includes('active')) {
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
  elementClear.addEventListener('click', function () {
    elementLink.value = '';
  });

  elementLink.addEventListener('focusin', function () {
    if (this.value && !elementClear.className.includes('active')) {
      elementClear.classList.add('active');
    }
  });

  elementLink.addEventListener('input', function () {
    const val = this.value;
    if (val && !elementClear.className.includes('active')) {
      elementClear.classList.add('active');
    } else if (!val) {
      elementClear.classList.remove('active');
    }
  });

  elementLink.addEventListener('focusout', function () {
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
    <button class="form-control__wrap--top__setting btn btn--primary">
      <span class="material-symbols-outlined"> settings </span>
    </button>
  </div>
  <!-- box option to clone -->
  <div class="form-control__options"></div>
  `;
  element.insertBefore(mission, element.lastElementChild);
  await addAnimation({ element: mission, animationName: 'fadeInZoom', timeSet: 400, hasDisplay: false });

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
