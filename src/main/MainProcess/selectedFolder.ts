import { ipcMain, dialog } from "electron";
import { mainWindow } from "../index";
import { getSelectedFolder, setSelectedFolder } from "../settings";

ipcMain.on("openFolderDialog", async (event) => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ["openDirectory"]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    event.sender.send("selectedFolder", result.filePaths[0]);
    setSelectedFolder(result.filePaths[0]);
  }
});

ipcMain.handle("getSelectedFolder", () => {
  return getSelectedFolder();
});
