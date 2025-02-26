import React, { useEffect, useState } from "react";
import ToggleTheme from "@/components/ToggleTheme";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/LangToggle";
import Footer from "@/components/template/Footer";
import InitialIcons from "@/components/template/InitialIcons";

export default function HomePage() {
  const { t } = useTranslation();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.on("update-available", () => {
      setUpdateAvailable(true);
    });

    window.electron.ipcRenderer.on("update-downloaded", () => {
      setUpdateAvailable(false);
      setUpdateDownloaded(true);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners("update-available");
      window.electron.ipcRenderer.removeAllListeners("update-downloaded");
    };
  }, []);

  const handleDownloadUpdate = () => {
    window.electron.ipcRenderer.send("download-update");
  };

  const handleRestartAndUpdate = () => {
    window.electron.ipcRenderer.send("restart-and-update");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <InitialIcons />
        <span>
          <h1 className="font-mono text-4xl font-bold">{t("appName")}</h1>
          <p className="text-end text-sm uppercase text-muted-foreground" data-testid="pageTitle">
            {t("titleHomePage")}
          </p>
        </span>
        <LangToggle />
        <ToggleTheme />
      </div>
      <Footer />

      {/* Update Button - Appears when an update is available */}
      {updateAvailable && (
        <button
          onClick={handleDownloadUpdate}
          className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded shadow-lg"
        >
          {t("updateAvailable")}
        </button>
      )}

      {/* Restart & Install Button - Appears after download */}
      {updateDownloaded && (
        <button
          onClick={handleRestartAndUpdate}
          className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg"
        >
          {t("restartToUpdate")}
        </button>
      )}
    </div>
  );
}
