import { createContext, useState, useEffect } from "react";

export type ContextType = {
  dataList: DataList[];
  dataListComplete: DataList[];
};

interface Props {
  children: React.ReactNode;
}

export interface DataList {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  progress: number;
  filePath: string;
}

export const DownloadContext = createContext<ContextType | null>(null);

const DownloadProvider: React.FC<Props> = ({ children }) => {
  const [dataList, setDataList] = useState<DataList[]>([]);
  const [dataListComplete, setDataListComplete] = useState<DataList[]>([]);

  const setPercentOnDownload = (id: string, percent: number): void => {
    setDataList((prev) => {
      const newArray = prev.map((item) => {
        if (item.id === id) {
          return { ...item, progress: percent };
        }
        return item;
      });

      const complete = newArray.filter((item) => item.progress >= 100);

      setDataListComplete((prev) => [...complete, ...prev]);

      //remove item from array
      const filtered = newArray.filter((item) => item.progress < 100);

      return filtered;
    });
  };

  useEffect(() => {
    if (!window) return;
    window.api.youtube.getPercent((data: { id: string; percent: number }) => {
      setPercentOnDownload(data.id, data.percent);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.api.youtube.getVideoInfos((infos: any) => {
      setDataList((prev) => [...prev, infos]);
    });
  }, []);

  return (
    <DownloadContext.Provider value={{ dataList, dataListComplete }}>
      {children}
    </DownloadContext.Provider>
  );
};

export default DownloadProvider;
