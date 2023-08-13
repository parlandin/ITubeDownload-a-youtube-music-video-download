import { DownloadContext, ContextType } from "@renderer/context/downloadContext";
import { useContext } from "react";

const useDownloads = (): ContextType => {
  const context = useContext(DownloadContext);

  if (!context) {
    throw new Error("useDownloads must be used within an DownloadProvider");
  }

  return context;
};

export default useDownloads;
