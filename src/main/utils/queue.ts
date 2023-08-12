import Queue from "queue";
import { getStore } from "../settings";

const queue = new Queue({
  concurrency: (getStore("settings") as { maxDownloadsConcurrency: number })
    .maxDownloadsConcurrency,
  autostart: true,
  results: []
});

export default queue;
