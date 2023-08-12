import Queue from "queue";
import { getMaxDownloadsConcurrency, OnChangeMaxDownloadsConcurrency } from "../settings";

const queue = new Queue({
  concurrency: getMaxDownloadsConcurrency() || 1,
  autostart: true,
  results: []
});

OnChangeMaxDownloadsConcurrency((maxDownloadsConcurrency) => {
  queue.concurrency = maxDownloadsConcurrency;
});

export default queue;
