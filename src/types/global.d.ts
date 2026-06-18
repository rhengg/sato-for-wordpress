export {};

declare global {
  interface Window {
    satoConfig: {
      nonce: string;
      apiUrl: string;
    };
  }
}
