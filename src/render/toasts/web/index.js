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
      background: 'orange',
      // icon: {
      //   className: 'material-icons',
      //   tagName: 'i',
      //   text: 'warning',
      // },
    },
    {
      type: 'success',
      background: 'green',
      duration: 5000,
      // icon: {
      //   className: 'material-icons',
      //   tagName: 'i',
      //   text: 'check_circle',
      // },
    },
    {
      type: 'error',
      background: 'indianred',
      duration: 5000,
      dismissible: true,
    },
  ],
});
