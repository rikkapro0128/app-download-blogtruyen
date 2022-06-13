import { Notyf } from 'notyf';

export default new Notyf({
  duration: 1000,
  position: {
    x: 'right',
    y: 'bottom',
  },
  types: [
    {
      type: 'warning',
      background: 'rgb(247, 154, 99)',
      duration: 5000,
      icon: {
        className: 'material-symbols-outlined',
        tagName: 'span',
        text: 'warning',
      },
      dismissible: true,
    },
    {
      type: 'success',
      background: 'rgb(123, 213, 85)',
      duration: 5000,
      dismissible: true,
    },
    {
      type: 'error',
      background: 'rgb(232, 93, 117)',
      duration: 5000,
      dismissible: true,
    },
  ],
});
