const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require('electron');
const path = require('path');

let overlayWindow = null;

let isQuitting = false;

function createOverlay() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 220,
    height: 160,
    x: width - 240,
    y: 40,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  overlayWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
    }
  });

  overlayWindow.setAlwaysOnTop(true, 'screen-saver');
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  overlayWindow.loadFile('index.html');
}

function bringOverlayToFront() {
  if (!overlayWindow) return;
  if (overlayWindow.isMinimized()) overlayWindow.restore();
  overlayWindow.show();
  overlayWindow.setAlwaysOnTop(false);
  overlayWindow.setAlwaysOnTop(true, 'screen-saver');
  overlayWindow.moveTop();
  overlayWindow.focus();
}

app.whenReady().then(() => {
  createOverlay();

  // Global shortcut: works even when the overlay isn't focused, and even
  // when some other fullscreen app currently has focus.
  const registeredFront = globalShortcut.register('CommandOrControl+Shift+V', () => {
    bringOverlayToFront();
  });

  if (!registeredFront) {
    console.warn('[overlay] Ctrl+Shift+V could not be registered — another app may already be using it.');
  }

  const registeredQuit = globalShortcut.register('CommandOrControl+Shift+Alt+Q', () => {
    isQuitting = true;
    app.quit();
  });

  if (!registeredQuit) {
    console.warn('[overlay] Ctrl+Shift+Alt+Q could not be registered — another app may already be using it.');
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('overlay-action', (_event, actionName) => {
  console.log(`[overlay] button clicked: ${actionName}`);
  // TO DO: put actual functions per action here
});

ipcMain.on('overlay-set-click-through', (_event, enabled) => {
  if (overlayWindow) {
    overlayWindow.setIgnoreMouseEvents(enabled);
  }
});
