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

const setDefaultSettings = (): void => {
  if (getStore("settings") === undefined) {
    setStore("settings", {
      selectedFolder: app.getPath("music"),
      maxDownloadsConcurrency: 1
    });
  }
};

export default setDefaultSettings;
