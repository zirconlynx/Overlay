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
  with other windows — floating on top by itself doesn't need special
  permissions.
