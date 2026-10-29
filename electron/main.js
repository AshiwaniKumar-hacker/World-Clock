const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

const isDev = !app.isPackaged || !!process.env.ELECTRON_START_URL;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 680,          // ← smaller width
    height: 520,         // ← smaller height
    minWidth: 420,
    minHeight: 360,

    frame: false,
    transparent: true,
    alwaysOnTop: false,  // ← IMPORTANT: no longer on top of other apps
    resizable: true,
    hasShadow: true,
    backgroundColor: '#00000000',
    show: true,
    center: true,

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
    },
  });

  let startUrl;

  if (process.env.ELECTRON_START_URL) {
    startUrl = process.env.ELECTRON_START_URL;
  } else if (isDev) {
    startUrl = 'http://localhost:3000';
  } else {
    startUrl = `file://${path.join(__dirname, '../build/index.html')}`;
  }

  console.log('Loading URL:', startUrl);

  mainWindow.loadURL(startUrl).catch((err) => {
    console.error('Failed to load URL:', err);
  });

  mainWindow.focus();

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('toggle-always-on-top', () => {
  if (mainWindow) {
    const current = mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(!current);
  }
});