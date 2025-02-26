import { app, BrowserWindow, dialog, ipcMain } from "electron";
import registerListeners from "./helpers/ipc/listeners-register";
import path from "path";
import { autoUpdater } from "electron-updater";
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

const inDevelopment = process.env.NODE_ENV === "development";

let mainWindow: BrowserWindow | null = null;
let updateAvailable = false; // Track update status

function createWindow() {
  const preload = path.join(__dirname, "preload.js");

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: inDevelopment,
      contextIsolation: true,
      nodeIntegration: true,
      preload: preload,
    },
    titleBarStyle: "hidden",
  });

  registerListeners(mainWindow);

  const VITE_DEV_SERVER_URL = process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL;
  const VITE_NAME = process.env.MAIN_WINDOW_VITE_NAME || "index";

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${VITE_NAME}/index.html`)
    );
  }
}

// Install React DevTools in development
async function installExtensions() {
  try {
    const result = await installExtension(REACT_DEVELOPER_TOOLS);
    console.log(`Extensions installed successfully: ${result.name}`);
  } catch {
    console.error("Failed to install extensions");
  }
}

// Check for updates and notify the renderer
function checkForUpdates() {
  autoUpdater.checkForUpdates();
}

// Auto-Updater Events
autoUpdater.on("update-available", () => {
  updateAvailable = true;
  if (mainWindow) {
    mainWindow.webContents.send("update-available");
  }
});

autoUpdater.on("update-not-available", () => {
  updateAvailable = false;
});

autoUpdater.on("update-downloaded", () => {
  if (mainWindow) {
    mainWindow.webContents.send("update-downloaded");
  }
});

// IPC Listener for manual update trigger
ipcMain.on("start-update", () => {
  autoUpdater.quitAndInstall();
});

// Initialize the app
app.whenReady().then(() => {
  createWindow();
  installExtensions();
  checkForUpdates();
});

// macOS-specific behavior
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
