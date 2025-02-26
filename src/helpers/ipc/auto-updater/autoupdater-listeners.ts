// src/helpers/ipc/auto-updater/autoupdater-listeners.ts
import { autoUpdater } from "electron-updater";
import { ipcMain, BrowserWindow } from "electron";

export function addAutoUpdaterListeners(mainWindow: BrowserWindow) {
  autoUpdater.autoDownload = false; // Prevents automatic update download
  autoUpdater.autoInstallOnAppQuit = false; // Prevents installation on quit

  autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("update-available"); // Notify frontend
  });

  ipcMain.on("download-update", async () => {
    await autoUpdater.downloadUpdate();
  });

  autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("update-downloaded"); // Notify frontend
  });

  ipcMain.on("restart-and-update", () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.checkForUpdates();
}
