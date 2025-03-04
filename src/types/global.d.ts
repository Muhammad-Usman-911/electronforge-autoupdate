export {};

declare global {
  interface Window {
    autoUpdates: {
      checkForUpdates: () => Promise<void>;
      downloadUpdate: () => Promise<void>;
      installUpdate: () => Promise<void>;
      onUpdateAvailable: (callback: () => void) => void;
      onUpdateDownloaded: (callback: () => void) => void;
      onDownloadProgress: (callback: (progress: number) => void) => void;
    };
  }
}
