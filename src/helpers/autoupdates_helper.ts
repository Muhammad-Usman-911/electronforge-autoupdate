// helpers/autoupdates_helper.ts
export async function checkForUpdates() {
    return await window.autoUpdates.checkForUpdates();
  }
  
  export async function downloadUpdate() {
    return await window.autoUpdates.downloadUpdate();
  }
  
  export async function installUpdate() {
    return await window.autoUpdates.installUpdate();
  }
  