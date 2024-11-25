const { app, BrowserWindow, Menu, ipcMain } = require('electron');

DEFAULT_BORDER_COLOR = '#ff0000';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Redframer',
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.setAlwaysOnTop(true);

  mainWindow.webContents.once('dom-ready', () => {
    setBorderColor(mainWindow, DEFAULT_BORDER_COLOR);
  });
}

function createColorPickerWindow(parentWindowId) {
  const parentWindow = BrowserWindow.fromId(parentWindowId);

  const useData = JSON.stringify([parentWindowId, parentWindow.currentBorderColor]);

  const colorPickerWindow = new BrowserWindow({
    width: 200,
    height: 60,
    title: 'Color Picker',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      additionalArguments: [`--userData=${useData}`],
    },
  });

  colorPickerWindow.loadFile('colorpicker.html');

  return colorPickerWindow;
}

function setBorderColor(window, color) {
  window.currentBorderColor = color;
  window.webContents.send('change-border-color', color);
}

app.once('ready', function() {
  createWindow();

  // メニューを定義
  const appMenu = Menu.buildFromTemplate([
    {
      label: 'アプリケーション',
      submenu: [
        { label: '新しいウィンドウ', click: createWindow, accelerator: 'Space' },
        { label: '色を変更', click: () => { createColorPickerWindow(BrowserWindow.getFocusedWindow().id) } },
        { type: 'separator' },
        { label: '閉じる', role: 'close' },
        { label: 'Developer Toolsを開く', role: 'toggleDevTools' },
        { label: '終了', role: 'quit' }
      ]
    },
  ]);

  Menu.setApplicationMenu(appMenu);
});

ipcMain.on('set-color', (event, { color, parentWindowId }) => {
  const parentWindow = BrowserWindow.fromId(parentWindowId);
  if (parentWindow) {
    setBorderColor(parentWindow, color);
  }
});


app.once('window-all-closed', () => app.quit());