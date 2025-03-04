// helpers/autoupdates/autoupdates-listeners.ts
import { autoUpdater } from "electron-updater";
import { ipcMain, BrowserWindow } from "electron";
import {
  AUTO_UPDATE_CHECK_CHANNEL,
  AUTO_UPDATE_DOWNLOAD_CHANNEL,
  AUTO_UPDATE_INSTALL_CHANNEL,
  AUTO_UPDATE_AVAILABLE_CHANNEL,
  AUTO_UPDATE_DOWNLOADED_CHANNEL,
  AUTO_UPDATE_PROGRESS_CHANNEL,
} from "./autoupdates-channels";

export function addAutoUpdateListeners(mainWindow: BrowserWindow) {
  ipcMain.handle(AUTO_UPDATE_CHECK_CHANNEL, async () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  ipcMain.handle(AUTO_UPDATE_DOWNLOAD_CHANNEL, async () => {
    autoUpdater.downloadUpdate();
  });

  ipcMain.handle(AUTO_UPDATE_INSTALL_CHANNEL, async () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on("update-available", () => {
    if (mainWindow) mainWindow.webContents.send(AUTO_UPDATE_AVAILABLE_CHANNEL);
  });

  autoUpdater.on("update-downloaded", () => {
    if (mainWindow) mainWindow.webContents.send(AUTO_UPDATE_DOWNLOADED_CHANNEL);
  });

  autoUpdater.on("download-progress", (progress) => {
    if (mainWindow) mainWindow.webContents.send(AUTO_UPDATE_PROGRESS_CHANNEL, progress.percent);
  });
}
