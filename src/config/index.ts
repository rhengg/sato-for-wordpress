type configTypes = {
  BASE_URL: string;
  IMAGE_CDN_URL: string;
  RAZORPAY_KEY: string;
  VIDEO_CDN_URL: string;
  WEBFLOW_CLIENT_ID: string;
  IP_API: string;
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
};

const config: configTypes = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_CDN_URL: import.meta.env.VITE_IMAGE_CDN_URL,
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY,
  VIDEO_CDN_URL: import.meta.env.VITE_VIDEO_CDN_URL,
  WEBFLOW_CLIENT_ID: import.meta.env.VITE_WEBFLOW_CLIENT_ID,
  IP_API: "https://pro.ip-api.com/json?key=MA2LvB9dkuoIKDi",
  OAUTH_CLIENT_ID: import.meta.env.VITE_OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
};

export default config;
