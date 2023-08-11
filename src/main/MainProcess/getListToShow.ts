import { ipcMain } from "electron";
import formatListsToShow, { IFormattedReturn } from "../utils/formatListsToShow";

const getListToShow = async (url: string): Promise<IFormattedReturn> => {
  const infos = await formatListsToShow(url);
  return infos;
};

ipcMain.handle("getListOfVideos", async (_event, url: string) => {
  return await getListToShow(url);
});
