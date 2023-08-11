import { ElectronAPI } from "@electron-toolkit/preload";
import { APIInterface } from "./index";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: APIInterface;
  }
}
