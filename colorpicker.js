const { ipcRenderer } = require('electron');

console.log({ argv: process.argv });
const userDataArg = process.argv.find(arg => arg.startsWith('--userData='));
const [parentWindowId, defaultColor] = JSON.parse(userDataArg.split('=').pop());

window.addEventListener('load', () => {
  const colorPicker = document.getElementById('colorpicker');
  colorPicker.addEventListener('input', (event) => {
    console.log('Selected color:', event.target.value); // 選択された色をログに表示
  });
  colorPicker.value = defaultColor;

  document.getElementById('submit').addEventListener('click', () => {
    const color = colorPicker.value;
    if (color != undefined) {
      ipcRenderer.send('set-color', { color, parentWindowId });
      window.close();
    }
  });

  document.getElementById('cancel').addEventListener('click', () => {
    window.close();
  });
});
