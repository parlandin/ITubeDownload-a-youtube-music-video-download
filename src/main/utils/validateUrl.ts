import ytdl from "@distube/ytdl-core";

export default (url: string): boolean => {
  return ytdl.validateURL(formatLink(url));
};

export function formatLink(link): string {
  if (link.startsWith("https//")) {
    link = link.replace("https//", "https://");
  } else if (link.startsWith("http//")) {
    link = link.replace("http//", "http://");
  }

  if (!/^https?:\/\//i.test(link)) {
    link = "https://" + link;
  }

  if (link.includes("youtube.com")) {
    link = link.replace(/^(https?:\/\/)?(www\.)?youtube\.com/i, "https://www.youtube.com");
  } else if (link.includes("youtu.be")) {
    link = link.replace(/^(https?:\/\/)?(www\.)?youtu\.be/i, "https://youtu.be");
  }

  return link;
}
