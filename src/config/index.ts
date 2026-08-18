type configTypes = {
  BASE_URL: string;
  IMAGE_CDN_URL: string;
  VIDEO_CDN_URL: string;
  IP_API: string;
};

const config: configTypes = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_CDN_URL: import.meta.env.VITE_IMAGE_CDN_URL,
  VIDEO_CDN_URL: import.meta.env.VITE_VIDEO_CDN_URL,
  IP_API: "https://pro.ip-api.com/json?key=MA2LvB9dkuoIKDi",
};

export default config;
