const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlayAPI', {
  triggerAction: (name) => ipcRenderer.send('overlay-action', name),
  setClickThrough: (enabled) => ipcRenderer.send('overlay-set-click-through', enabled)
});
