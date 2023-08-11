import { ipcMain, dialog } from "electron";
import { mainWindow } from "../index";
import { getStore, setStore } from "../settings";

ipcMain.on("openFolderDialog", async (event) => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ["openDirectory"]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    event.sender.send("selectedFolder", result.filePaths[0]);
    setStore("settings", {
      selectedFolder: result.filePaths[0]
    });
  }
});

ipcMain.handle("getSelectedFolder", (event) => {
  return (getStore("settings") as { selectedFolder: string | undefined }).selectedFolder;
});
