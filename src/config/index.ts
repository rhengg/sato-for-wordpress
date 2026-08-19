type configTypes = {
  BASE_URL: string;
  IMAGE_CDN_URL: string;
  VIDEO_CDN_URL: string;
};

const config: configTypes = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_CDN_URL: import.meta.env.VITE_IMAGE_CDN_URL,
  VIDEO_CDN_URL: import.meta.env.VITE_VIDEO_CDN_URL,
};

export default config;
