import { ipcMain } from "electron";
import { getMaxDownloadsConcurrency, setMaxDownloadsConcurrency } from "../settings";

ipcMain.handle("setConcurrencyDownloads", (_event, concurrencyNumber) => {
  return setMaxDownloadsConcurrency(concurrencyNumber);
});

ipcMain.handle("getConcurrencyDownloads", () => {
  return getMaxDownloadsConcurrency();
});
