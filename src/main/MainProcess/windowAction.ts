import { mainWindow } from "../index";
import { ipcMain } from "electron";

ipcMain.on("minimize", () => {
  mainWindow?.minimize();
});

ipcMain.on("close", () => {
  mainWindow?.close();
});
