export function exposeAutoUpdateContext() {
    const { contextBridge, ipcRenderer } = window.require("electron");
  
    contextBridge.exposeInMainWorld("autoUpdates", {
      checkForUpdates: () => ipcRenderer.invoke("auto-update:check"),
      downloadUpdate: () => ipcRenderer.invoke("auto-update:download"),
      installUpdate: () => ipcRenderer.invoke("auto-update:install"),
      onUpdateAvailable: (callback: () => void) =>
        ipcRenderer.on("auto-update:available", () => callback()),
      onUpdateDownloaded: (callback: () => void) =>
        ipcRenderer.on("auto-update:downloaded", () => callback()),
      onDownloadProgress: (callback: (progress: number) => void) =>
        ipcRenderer.on("auto-update:progress", (_: Event, progress: number) => callback(progress)),
    });
  }
  