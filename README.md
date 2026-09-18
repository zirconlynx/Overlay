# Overlay App

**Author:** zirconlynx

A small, gray, always-on-top overlay window that floats above whatever else
is running on your screen — games, browsers, other apps. It's frameless,
draggable by its title strip, and has three placeholder menu buttons with no
behavior wired up yet.

## Getting started (step by step)

These steps take you from a fresh computer to the overlay running on
screen. If you already have Node.js installed, skip to step 3.

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
   `.exe` on Windows, a `.dmg` on Mac, or an `.AppImage` on Linux). On
   Mac, see **Installing on macOS** below before opening it.

## Installing on macOS

The first time you open the built app, macOS will likely say it "cannot
be opened because Apple cannot check it for malicious software," or that
the app "is damaged and should be moved to the Trash." **This isn't
actually malware** — it's Gatekeeper, macOS's built-in check that blocks
any app that isn't signed with a paid Apple Developer certificate and
notarized by Apple ($99/year). This project doesn't have one, so every
copy of it — built by you or anyone else — will trigger this the first
time, no matter what. It only needs to be bypassed once per computer.

**Option A — Finder (try this first):**
1. Open the `.dmg` and drag `OverlayApp` into Applications, like normal.
2. Don't double-click it. Instead, right-click (or Control-click) the
   app in Applications and choose **Open**.
3. A dialog pops up warning you again — click **Open** on that dialog.
   From then on, double-clicking the app works normally.

**Option B — Terminal (use this if you saw "is damaged," or Option A's
Open dialog didn't appear):**
1. Open Terminal (Spotlight → type "Terminal").
2. Run this, which removes the flag macOS adds to anything downloaded
   from the internet that makes Gatekeeper suspicious of it:
   ```bash
   xattr -cr /Applications/OverlayApp.app
   ```
   (adjust the path if you put it somewhere other than Applications)
3. Open the app normally.

If neither works, check **System Settings → Privacy & Security** and
scroll down — macOS sometimes puts an **Open Anyway** button there next
to a mention of the blocked app, after the first attempt to open it. If it still doesn't work, then you're cooked.
