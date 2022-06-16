import tippy from 'tippy.js';

export const tooltipInit = () => {
  tippy('[data-tippy-content]', {
    placement: 'right',
    theme: 'miru',
    delay: 1000,
    duration: 100,
  });
};
