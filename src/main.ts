import { app, BrowserWindow, ipcMain } from "electron";
import registerListeners from "./helpers/ipc/listeners-register";
import path from "path";
import { autoUpdater } from "electron-updater";
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

const inDevelopment = process.env.NODE_ENV === "development";

let store: any; // Temporary until we import dynamically
let mainWindow: BrowserWindow | null = null;

async function createWindow() {
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

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  await importStore(); // ✅ Ensure electron-store is available
  checkForUpdates(); // ✅ Start update check after store is loaded
}

async function importStore() {
  const ElectronStore = (await import("electron-store")).default;
  store = new ElectronStore<{ "update-available": boolean }>();
}

async function installExtensions() {
  try {
    const result = await installExtension(REACT_DEVELOPER_TOOLS);
    console.log(`Extensions installed successfully: ${result.name}`);
  } catch {
    console.error("Failed to install extensions");
  }
}

app.whenReady().then(createWindow).then(installExtensions);

// macOS only
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

// Function to check for updates
async function checkForUpdates() {
  if (!store) await importStore(); // Ensure store is available

  store.set("update-available", false); // Default flag to false

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("update-available", () => {
    console.log("Update available!");
    store.set("update-available", true);
    if (mainWindow) mainWindow.webContents.send("update-available");
  });

  autoUpdater.on("update-not-available", () => {
    console.log("No updates found.");
    store.set("update-available", false);
  });

  autoUpdater.on("download-progress", (progress) => {
    if (mainWindow)
      mainWindow.webContents.send("download-progress", progress.percent);
  });

  autoUpdater.on("update-downloaded", () => {
    console.log("Update downloaded, ready to install.");
    store.set("update-available", true);
    if (mainWindow) mainWindow.webContents.send("update-downloaded");
  });
}

// IPC Methods for Renderer Process
ipcMain.handle("check-for-update", async () => {
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.handle("download-update", async () => {
  autoUpdater.downloadUpdate();
});

ipcMain.handle("install-update", async () => {
  autoUpdater.quitAndInstall();
});
