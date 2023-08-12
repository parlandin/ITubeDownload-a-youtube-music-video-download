import Store from "electron-store";
import { app } from "electron";

export const store = new Store({
  encryptionKey: "encryptionKey"
});

export const getStore = (key: string): unknown => {
  return store.get(key);
};

export const setStore = (key: string, value: unknown): void => {
  store.set(key, value);
};

export const getSelectedFolder = (): string => {
  const selectedFolder = getStore("settings.selectedFolder") as string;
  return selectedFolder;
};

export const setSelectedFolder = (path: string): void => {
  setStore("settings.selectedFolder", path);
};

export const getMaxDownloadsConcurrency = (): number => {
  const maxDownloadsConcurrency = getStore("settings.maxDownloadsConcurrency") as number;
  return maxDownloadsConcurrency;
};

export const setMaxDownloadsConcurrency = (maxDownloadsConcurrency: number): void => {
  setStore("settings.maxDownloadsConcurrency", maxDownloadsConcurrency);
};

export const OnChangeMaxDownloadsConcurrency = (
  callback: (maxDownloadsConcurrency: number) => void
): void => {
  store.onDidChange("settings.maxDownloadsConcurrency", (newValue) => {
    callback(newValue as number);
  });
};

const setDefaultSettings = (): void => {
  if (getStore("settings") === undefined) {
    setStore("settings", {
      selectedFolder: app.getPath("music"),
      maxDownloadsConcurrency: 1
    });
  }
};

export default setDefaultSettings;
