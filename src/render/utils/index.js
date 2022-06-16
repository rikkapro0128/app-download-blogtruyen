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
    element.setAttribute(
      'style',
      `
      ${hasDisplay ? 'display: block;' : ''}
      animation: ${animationName} ${timeSet}ms ease-in-out forwards;
    `,
    );
    setTimeout(() => {
      res(element);
    }, timeSet);
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

export function removeAnimation({ element, timeSet = 0, justAnimation = false }) {
  return new Promise((res) => {
    if (justAnimation) {
      element.setAttribute('style', 'display: block;');
    } else {
      element.setAttribute('style', '');
    }
    setTimeout(() => {
      res(element);
    }, timeSet);
  });
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
    <div class="form--wrap">
      <input spellcheck="false" class="form--wrap__fill link--image" type="text" placeholder="Link manga..." />
      <span class="form--wrap__clear material-symbols-outlined">backspace</span>
    </div>
    <button class="btn btn--primary form-control__clear-fill">
    <span class="material-symbols-outlined">
    remove
    </span>
    </button>
    <button class="btn btn--primary form-control__setting">
      <span class="material-symbols-outlined">
        settings
      </span>
    </button>
  `;
  element.insertBefore(mission, element.lastElementChild);
  await addAnimation({ element: mission, animationName: 'fadeInZoom', timeSet: 400, hasDisplay: false });

  return Promise.resolve(mission);
}

export function toggleClassBindElement({ element, className = 'active' }) {
  if (element.className.includes(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}
