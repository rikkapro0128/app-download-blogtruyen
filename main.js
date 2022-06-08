const { app, BrowserWindow, ipcMain } = require("electron");
const electronReload = require("electron-reload");
const path = require("path");

electronReload(__dirname, {});

let percent = 0;

const createWindow = ({ width, height }) => {
  const win = new BrowserWindow({
    width: width || 800,
    height: height || 600,
    icon: `${__dirname}/src/public/assets/images/blogtruyen-logo.jpg`,
    title: "Tool Download Blogtruyen",
    webPreferences: {
      preload: path.join(__dirname, "preload", "index.js"),
    },
  });
  win.removeMenu();
  win.loadURL(`file://${__dirname}/src/public/index.html`);
  win.webContents.openDevTools();
  return win;
};

ipcMain.emit("miru:percent", "done");

app.whenReady().then(() => {
  const win = createWindow({});
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
