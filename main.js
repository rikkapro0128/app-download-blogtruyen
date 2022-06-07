const { app, BrowserWindow, } = require("electron");
const electronReload = require('electron-reload');
const path = require('path');

electronReload(__dirname, {
  // electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  // hardResetMethod: 'exit'
});


const createWindow = ({ width, height }) => {
  const win = new BrowserWindow({
    width: width || 800,
    height: height || 600,
    icon: `${__dirname}/src/public/assets/images/blogtruyen-logo.jpg`,
    title: "Tool Download Blogtruyen",
  });
  win.removeMenu();
  win.loadURL(`file://${__dirname}/src/public/index.html`);
};


app.whenReady().then(() => {
  createWindow({});
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
