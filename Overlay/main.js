const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require('electron');
const path = require('path');

let overlayWindow = null;

// Set to true only by the dedicated quit shortcut below. Any close attempt
// that happens while this is false (Alt+F4, etc.) gets blocked, so the
// global shortcut is the only in-app way to exit.
let isQuitting = false;

function createOverlay() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 220,
    height: 160,
    x: width - 240,   // start near the top-right corner
    y: 40,
    frame: false,           // no OS title bar/border
    transparent: true,      // lets our rounded gray box show through
    alwaysOnTop: true,      // stays above every other window
    resizable: false,
    movable: true,
    skipTaskbar: true,      // don't clutter the taskbar/dock
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Block every close attempt that isn't the dedicated quit shortcut
  // (Alt+F4, window.close(), etc.). isQuitting only flips to true inside
  // the Ctrl+Shift+Alt+Q handler below.
  overlayWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
    }
  });

  // On macOS/Linux this keeps it above fullscreen apps & other spaces too.
  overlayWindow.setAlwaysOnTop(true, 'screen-saver');
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  overlayWindow.loadFile('index.html');
}

// Forces the overlay above every other window, even ones that are
// themselves always-on-top (e.g. games, video players in fullscreen).
function bringOverlayToFront() {
  if (!overlayWindow) return;
  if (overlayWindow.isMinimized()) overlayWindow.restore();
  overlayWindow.show();
  // Cycling the always-on-top level re-asserts top position in the OS's
  // window stack, which a plain moveTop() doesn't always guarantee.
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

  // The ONLY in-app way to close the overlay. There's no X button in the
  // UI, Alt+F4 is blocked by the 'close' handler above, and window.close()
  // from the renderer would be blocked the same way. isQuitting is set
  // first so the 'close' handler lets this particular quit through.
  // Note: this can't stop an OS-level force kill (Task Manager "End Task"),
  // since no regular application can prevent that — it terminates the
  // process directly rather than asking it to close.
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

// --- IPC handlers for the placeholder menu buttons ---
// Wire real functionality up by handling these events; right now they just log.
ipcMain.on('overlay-action', (_event, actionName) => {
  console.log(`[overlay] button clicked: ${actionName}`);
  // TODO: hook up real behavior per action here
});

// Lets the renderer toggle click-through mode (so clicks pass to the
// window underneath the overlay instead of the overlay itself).
ipcMain.on('overlay-set-click-through', (_event, enabled) => {
  if (overlayWindow) {
    overlayWindow.setIgnoreMouseEvents(enabled);
  }
});
