import { ipcMain } from "electron";
import { downloadYoutube } from "../utils/downloadYoutube";
import validateUrl from "../utils/validateUrl";

ipcMain.on("download-url", async (event, data) => {
  const { url, folderSelected } = data;
  await downloadYoutube(url, event, folderSelected);
});

ipcMain.handle("validateUrl", (_event, data) => {
  const { url } = data;
  return validateUrl(url);
});
