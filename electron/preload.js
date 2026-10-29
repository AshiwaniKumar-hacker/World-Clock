/**
 * Preload script – exposes a safe, limited API to the renderer process.
 * This is the bridge between React and Electron main process.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
  toggleAlwaysOnTop: () => ipcRenderer.send('toggle-always-on-top'),
  
  // Detect if running inside Electron
  isElectron: true,
});
