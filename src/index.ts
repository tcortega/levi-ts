import "dotenv/config";
import config from "./config";
import LeviBot from "./libs/Levi";
import { QRFormat, QRQuality } from "@open-wa/wa-automate";

new LeviBot(config, {
  authTimeout: 0,
  cacheEnabled: false,
  cachedPatch: true,
  chromiumArgs: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--aggressive-cache-discard",
    "--disable-cache",
    "--disable-application-cache",
    "--disable-offline-load-stale-cache",
    "--disk-cache-size=0",
  ],
  deleteSessionDataOnLogout: false,
  disableSpins: true,
  headless: true,
  killProcessOnBrowserClose: true,
  qrFormat: QRFormat.PNG,
  qrLogSkip: false,
  qrQuality: QRQuality.EIGHT,
  qrTimeout: 0,
  restartOnCrash: true,
  throwErrorOnTosBlock: false,
  useChrome: true,
});
