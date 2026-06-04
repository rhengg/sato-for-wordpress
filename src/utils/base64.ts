import { Buffer } from "buffer";

export const decodeBase64 = (data: string) => {
  const buffer = data && Buffer.from(data as string, "base64");
  const decodedData = buffer && JSON.parse(buffer.toString("utf-8") || "{}");
  return decodedData;
};

export const encodeBase64 = (data: any) => {
  const buffer = data && Buffer.from(JSON.stringify(data));
  const encodedData = buffer && buffer.toString("base64");
  return encodedData;
};
