const { app, BrowserWindow } = require('electron');
const electronReload = require('electron-reload');
const path = require('path');

const { listEvent } = require('./src/event/index.js');

electronReload(__dirname, {});

const createWindow = async ({
  width = 600,
  height = 600,
  title = 'new title',
  center = true,
  backgroundColor = 'rgb(237, 241, 245)',
}) => {
  const win = new BrowserWindow({
    title,
    center,
    backgroundColor,
    width: width,
    height: height,
    minWidth: width,
    minHeight: height,
    maxWidth: width,
    maxHeight: height,
    icon: `${__dirname}/src/public/assets/images/blogtruyen-logo.jpg`,
    webPreferences: {
      preload: path.join(__dirname, 'src', 'contract', 'index.js'),
    },
  });
  win.removeMenu();
  await win.loadURL(`file://${__dirname}/src/public/index.html`);
  win.webContents.openDevTools(); // for enviroment development
  return win;
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.whenReady().then(async () => {
  const win = await createWindow({ title: 'Tool Download Blogtruyen' });
  listEvent(win);
});
