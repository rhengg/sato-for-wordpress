import axiosOriginal from "axios";
import config from "../config";

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
  // return date.toLocaleDateString("en-IN");
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const loadUserIp = async () => {
  const FALLBACK_COUNTRY = "US";

  try {
    const res = await axiosOriginal.get(config.IP_API);
    return res.data.countryCode?.toUpperCase() || FALLBACK_COUNTRY;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return FALLBACK_COUNTRY;
  }
};

export const fetchImage = async (url: string, retries = 2): Promise<Blob> => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const blob = await res.blob();
    console.log(blob);
    return blob;
  } catch (error) {
    if (retries > 0) {
      console.log("Retrying fetchImage...", retries);

      // wait before retry (important for CDN propagation)
      await new Promise((resolve) => setTimeout(resolve, 500));

      return fetchImage(url, retries - 1);
    }

    throw error; // finally fail
  }
};

export function sanitizeFileNameForS3Key(fileName: string) {
  // Split name and extension
  const parts = fileName.split(".");
  const ext = parts.pop()?.toLowerCase() || "";
  const base = parts.join("."); // In case name had multiple dots

  // Sanitize the base filename
  const cleanBase = base
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9\-_]+/g, "") // Allow only letters, numbers, -, _
    .toLowerCase();

  const randomFallback = "file_" + Math.floor(Math.random() * 100000);

  // Fallback when name becomes empty
  const finalBase = cleanBase || randomFallback;

  return ext ? `${finalBase}.${ext}` : finalBase;
}
