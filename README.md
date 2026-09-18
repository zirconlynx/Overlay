# Overlay App

1. **Install Node.js.** This app runs on Node.js/Electron, so you need
   Node installed first. Go to
   [https://nodejs.org/en](https://nodejs.org/en) and download the
   **LTS** version for your operating system, then run the installer
   with the default options.
2. **Confirm it installed correctly.** Open a terminal (Command Prompt
   on Windows, Terminal on Mac/Linux) and run:
   ```bash
   node -v
   npm -v
   ```
   Each should print a version number. If you get a "command not
   found" error, restart your terminal (or your computer) and try
   again — Node.js needs a fresh terminal session to be recognized.
3. **Open a terminal in the project folder.** On Windows, click into
   File Explorer's address bar while inside the `App` folder, type
   `cmd`, and press Enter. On Mac, right-click the folder and choose
   "New Terminal at Folder" (or `cd` into it manually).
4. **Install the app's dependencies.** In that terminal, run:
   ```bash
   npm install
   ```
   This downloads Electron and the other packages the app needs into a
   `node_modules` folder. It only needs to be done once (or again if
   you delete `node_modules`).
5. **Start the app.** Run:
   ```bash
   npm start
   ```
   You should see a small gray box appear near the top-right of your
   screen, on top of every other window.
6. **(Optional) Build a standalone app.** `npm start` needs this
   terminal process every time. If you'd rather have a normal
   double-clickable app instead, run:
   ```bash
   npm run dist
   ```
   and look in the new `dist` folder for the packaged app (a portable
   `.exe` on Windows, a `.dmg` on Mac, or an `.AppImage` on Linux).

## Shortcuts

- **Ctrl+Shift+V** — brings the overlay to the front, above every other
  window (even other always-on-top apps).
- **Ctrl+Shift+Alt+Q** — the *only* way to close the overlay. There's no
  close button in the UI, and Alt+F4 is now blocked too — the window
  refuses to close unless this exact shortcut triggered it. The one
  exception is an OS-level force kill (Task Manager → End Task), which no
  regular application can prevent, since it terminates the process
  directly instead of asking it to close.

## How it works

- **main.js** — the Electron main process. Creates the `BrowserWindow` with
  `alwaysOnTop: true`, `transparent: true`, and `frame: false`, which is what
  makes it float above other apps as a borderless gray box.
- **index.html** — the actual look of the overlay (the gray panel, title
  strip, and buttons). The title strip uses `-webkit-app-region: drag` so you
  can grab it and move the overlay around; buttons opt out with `no-drag` so
  clicks work normally.
- **preload.js** — safely exposes a small `window.overlayAPI` bridge from the
  renderer (index.html) to the main process, instead of turning on full
  Node access in the page.

## Wiring up real functionality

Each button sends an action name to the main process via
`window.overlayAPI.triggerAction('action-one')`. In **main.js**, the
`ipcMain.on('overlay-action', ...)` handler is where you'd add real behavior
— e.g. take a screenshot, run a script, toggle another feature, call an API,
etc. Right now it just logs the click to the console.

## App icon

`build/icon.ico` (Windows) and `build/icon.png` (Mac/Linux) are referenced
by the `build` config in `package.json` and get baked into the packaged
app automatically the next time you run `npm run dist` — no other setup
needed. To use your own icon, replace those two files (keep the same
names/paths), ideally starting from a square image at least 512x512px, and
rebuild.

## Useful things to customize next

- **Position/size**: change `width`, `height`, `x`, `y` in `main.js`.
- **Click-through mode**: call `window.overlayAPI.setClickThrough(true)` to
  let mouse clicks pass through the overlay to the window underneath it
  (handy if you want it purely informational at times). Call it with
  `false` to make it clickable again.
- **More buttons**: add more `<button data-action="...">` elements in
  `index.html` — no other wiring needed, they'll all route through the same
  `overlay-action` handler.
- **Auto-launch on login / packaging as an installer**: `npm run dist` uses
  `electron-builder` (already configured in `package.json`) to produce a
  Windows portable exe, a Mac dmg, or a Linux AppImage.

## Notes

- `skipTaskbar: true` keeps it out of the taskbar/dock, matching typical
  overlay-utility behavior.
- On macOS, an app like this needs Screen Recording / Accessibility
  permissions if you later want it to *read* what's on screen or interact
  with other windows — floating on top by itself doesn't need special
  permissions.
