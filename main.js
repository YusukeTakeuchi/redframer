const { app, BrowserWindow, Menu, Tray } = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Redframer',
    frame: false,
    transparent: true,
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.on('before-input-event', (event, input) => {
    processKey(mainWindow, input.key);
  });
}

function processKey(window, key) {
  if (key === 'Escape') {
    window.close();
  } else if (key === ' ') {
    createWindow();
  }
}

app.once('ready', function() {
  createWindow();

  // メニューを定義
  const dockMenu = Menu.buildFromTemplate([
    { label: '新しいウィンドウ', click: createWindow},
  ]);

  app.dock.setMenu(dockMenu);
});


app.once('window-all-closed', () => app.quit());