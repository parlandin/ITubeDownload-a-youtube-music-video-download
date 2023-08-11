import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { IFormattedReturn } from "../main/utils/formatListsToShow";

// Custom APIs for renderer
interface videoInfos {
  title: string;
  thumbnail: string;
  publishDate: string;
  category: string;
  lengthSeconds: string;
}

export interface APIInterface {
  youtube: {
    sendUrlToDownloading: (url: string, folderSelected?: string) => void;
    getPercent: (callback: (percent: number) => void) => void;
    getVideoInfos: (callback: (Infos: videoInfos) => void) => void;
    downloadError: (callback: (error: unknown) => void) => void;
    getFfmpegPath: (callback: (ffmpegPath: string) => void) => void;
    selectFolder: () => Promise<string>;
    getSelectedFolder: () => Promise<string>;
    validateUrl: (url: string) => Promise<boolean>;
    getListOfVideosInfos: (url: string) => Promise<IFormattedReturn>;
  };
  window: {
    minimize: () => void;
    close: () => void;
  };
}

const api = {
  youtube: {
    validateUrl: async (url: string): Promise<boolean> => {
      return ipcRenderer.invoke("validateUrl", { url });
    },

    getListOfVideosInfos: async (url: string): Promise<IFormattedReturn> => {
      return ipcRenderer.invoke("getListOfVideos", url);
    },

    sendUrlToDownloading: (url: string, folderSelected?: string): void =>
      ipcRenderer.send("download-url", { url, folderSelected }),
    getPercent: (callback: (percent: number) => void): void => {
      ipcRenderer.on("download-progress", (_event, percent) => {
        callback(percent);
      });
    },
    getVideoInfos: (callback: (Infos: videoInfos) => void): void => {
      ipcRenderer.on("video-details", (_event, infos) => {
        callback(infos);
      });
    },
    downloadError: (callback: (error: unknown) => void): void => {
      ipcRenderer.on("download-error", (_event, error) => {
        callback(error);
      });
    },
    getFfmpegPath: (callback: (ffmpegPath: string) => void): void => {
      ipcRenderer.on("ffmpegPath", (_event, ffmpegPath) => {
        callback(ffmpegPath);
      });
    },
    selectFolder: async (): Promise<string> => {
      return new Promise((resolve) => {
        ipcRenderer.once("selectedFolder", (_event, folderPath) => {
          resolve(folderPath);
        });

        ipcRenderer.send("openFolderDialog");
      });
    },

    getSelectedFolder: async (): Promise<string> => {
      return ipcRenderer.invoke("getSelectedFolder");
    }
  },
  window: {
    minimize: (): void => ipcRenderer.send("minimize"),
    close: (): void => ipcRenderer.send("close")
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
