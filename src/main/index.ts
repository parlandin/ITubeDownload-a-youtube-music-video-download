import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join, resolve } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import setDefaultSettings from "./settings";
import isDev from "electron-is-dev";

import "./MainProcess/downloadYoutube";
import "./MainProcess/selectedFolder";
import "./MainProcess/windowAction";
import "./MainProcess/getListToShow";
import "/src/main/MainProcess/ConcurrencyDownloads";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 670,
    resizable: false,
    show: false,
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true
    }
  });

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) return;
    mainWindow.show();

    // Set default settings
    setDefaultSettings();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("getAppVersion", () => {
  return app.getVersion();
});

//deep linking

if (isDev && process.platform === "win32") {
  // Set the path of electron.exe and your app.
  // These two additional parameters are only available on windows.
  // Setting this is required to get this working in dev mode.
  app.setAsDefaultProtocolClient("itube-download-link", process.execPath, [
    resolve(process.argv[1])
  ]);
} else {
  app.setAsDefaultProtocolClient("itube-download-link");
}

app.on("open-url", function (event, url) {
  event.preventDefault();
  const deeplinkingUrl = url;
  console.log({ macDeepLink: deeplinkingUrl });

  //mac deep link has not implemented yet
});

// Force single application instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_e, argv) => {
    if (process.platform !== "darwin") {
      const deeplinkingUrl = argv.find((arg) => arg.startsWith("itube-download-link://"));

      if (deeplinkingUrl) {
        const link = deeplinkingUrl.split("itube-download-link://")[1];
        mainWindow?.webContents.send("deep-download-link", link);
      }
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

export { mainWindow };
