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
}

export function addClassForAnimation({ className, element, timeSet = 600 }) {
  element.classList.add(className);
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, timeSet);
  });
}

export function addAnimation({ element, animationName, timeSet = 600 }) {
  return new Promise((res) => {
    element.setAttribute(
      'style',
      `
      display: block;
      animation: ${animationName} ${timeSet}ms ease-in-out forwards;
    `,
    );
    setTimeout(() => {
      res(element);
    }, timeSet);
  });
}

export function removeAnimation({ element, timeSet = 0 }) {
  return new Promise((res) => {
    element.setAttribute('style', '');
    setTimeout(() => {
      res(element);
    }, timeSet);
  });
}
