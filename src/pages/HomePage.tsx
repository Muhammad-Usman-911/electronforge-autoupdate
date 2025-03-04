import React, { useEffect, useState } from "react";
import ToggleTheme from "@/components/ToggleTheme";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/LangToggle";
import Footer from "@/components/template/Footer";
import InitialIcons from "@/components/template/InitialIcons";
import {
  checkForUpdates,
  downloadUpdate,
  installUpdate,
} from "@/helpers/autoupdates_helper";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { t } = useTranslation();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchUpdateStatus = async () => {
      const updateExists = await checkForUpdates();
      setUpdateAvailable(updateExists);
    };

    fetchUpdateStatus();
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadUpdate();
    setDownloading(false);
    setUpdateAvailable(true);
  };

  const handleInstall = async () => {
    await installUpdate();
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

        {updateAvailable && (
          <div className="mt-4 p-4 border rounded-md bg-gray-900 text-white">
            <p>🚀 A new update is available!</p>
            {downloading ? (
              <p>Downloading update...</p>
            ) : (
              <>
                <Button className="mt-2" onClick={handleDownload}>
                  Download Update
                </Button>
                <Button className="mt-2 ml-2" onClick={handleInstall}>
                  Install & Restart
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
