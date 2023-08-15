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

interface AudioDownload {
  videoInfos: unknown;
  quality: string;
  duration: string;
  thumbnail: string;
  title: string;
}

interface VideoDownload extends AudioDownload {
  audioQuality: string;
}

export interface APIInterface {
  youtube: {
    sendUrlToDownloading: (url: string, folderSelected?: string) => void;
    getPercent: (callback: (data: { id: string; percent: number }) => void) => void;
    getVideoInfos: (callback: (Infos: videoInfos) => void) => void;
    downloadError: (callback: (error: unknown) => void) => void;
    getFfmpegPath: (callback: (ffmpegPath: string) => void) => void;
    validateUrl: (url: string) => Promise<boolean>;
    getListOfVideosInfos: (url: string) => Promise<IFormattedReturn>;
    downloadAudio: (data: AudioDownload) => void;
    downloadVideo: (data: AudioDownload) => void;
    getFilePath: (filePath: string) => Promise<void>;
    onDeepLink: (callback: (url: string) => void) => void;
  };
  window: {
    minimize: () => void;
    close: () => void;
  };
  settings: {
    getMaxDownloadsConcurrency: () => Promise<number>;
    setMaxDownloadsConcurrency: (maxDownloadsConcurrency: number) => void;
    selectFolder: () => Promise<string>;
    getSelectedFolder: () => Promise<string>;
    getAppVersion: () => Promise<string>;
  };
  general: {
    logWarning: (message: string) => void;
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

    downloadAudio: (data: AudioDownload): void => {
      ipcRenderer.send("download-audio", data);
    },

    downloadVideo: (data: VideoDownload): void => {
      ipcRenderer.send("download-video", data);
    },

    sendUrlToDownloading: (url: string, folderSelected?: string): void => {
      return ipcRenderer.send("download-url", { url, folderSelected });
    },

    getPercent: (callback: (data: { id: string; percent: number }) => void): void => {
      ipcRenderer.on("download-progress", (_event, percent) => {
        callback(percent);
      });
    },
    getVideoInfos: (callback: (Infos: videoInfos) => void): void => {
      ipcRenderer.on("video-details", (_event, infos) => {
        callback(infos);
      });
    },

    getFilePath: async (filePath: string): Promise<void> => {
      return ipcRenderer.invoke("getFilePath", filePath);
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
    onDeepLink: (callback: (url: string) => void): void => {
      ipcRenderer.on("deep-download-link", (_event, url) => {
        callback(url);
      });
    }
  },
  window: {
    minimize: (): void => ipcRenderer.send("minimize"),
    close: (): void => ipcRenderer.send("close")
  },
  settings: {
    getMaxDownloadsConcurrency: (): Promise<number> => {
      return ipcRenderer.invoke("getConcurrencyDownloads");
    },
    setMaxDownloadsConcurrency: (maxDownloadsConcurrency: number): void => {
      ipcRenderer.invoke("setConcurrencyDownloads", maxDownloadsConcurrency);
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
    },

    getAppVersion: async (): Promise<string> => {
      return ipcRenderer.invoke("getAppVersion");
    }
  },
  general: {
    logWarning: (message: string): void => {
      ipcRenderer.send("logWarning", message);
    }
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
