const { ipcRenderer } = require('electron');

// メッセージを受信して、要素のborder-colorを変更
ipcRenderer.on('change-border-color', (event, color) => {
  console.log({color});
  const targetElement = document.getElementById('frame');
  if (targetElement) {
    targetElement.style.borderColor = color;
  }
});