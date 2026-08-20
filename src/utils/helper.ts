export const timeAgo = (dateString: number): string => {
  const now = new Date();
  const then = new Date(dateString * 1000);

  const secondsAgo = Math.floor((now.getTime() - then.getTime()) / 1000);

  const intervals = [
    { label: "yr", seconds: 31536000 },
    { label: "mon", seconds: 2592000 },
    { label: "wk", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
    { label: "sec", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

export const validatePassword = (value: string) => {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/~`]).{8,}$/;
  return regex.test(value);
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const fetchImage = async (url: string, retries = 2): Promise<Blob> => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    const blob = await res.blob();
    return blob;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return fetchImage(url, retries - 1);
    }
    throw error;
  }
};

export function sanitizeFileNameForS3Key(fileName: string) {
  const parts = fileName.split(".");
  const ext = parts.pop()?.toLowerCase() || "";
  const base = parts.join(".");
  const cleanBase = base
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-_]+/g, "")
    .toLowerCase();
  const randomFallback = "file_" + Math.floor(Math.random() * 100000);
  const finalBase = cleanBase || randomFallback;
  return ext ? `${finalBase}.${ext}` : finalBase;
}

export function readableSizeFromMB(mb: number) {
  const sizes = ["MB", "GB", "TB", "PB"];
  let size = Number(mb);
  let i = 0;

  while (size >= 1024 && i < sizes.length - 1) {
    size /= 1024;
    i++;
  }

  return `${parseInt(size.toString())} ${sizes[i]}`;
}
