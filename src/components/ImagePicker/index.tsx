import React from "react";
import "./imagepicker.css";
import axios from "../../utils/axios-instance";
import axiosOriginal from "axios";
import Cookies from "js-cookie";
import Loader from "../Loader";
import SparkMd5 from "spark-md5";
import { Buffer } from "buffer";
import Tooltip from "../Tooltip";
import Premium from "../PremiumIcon";
import { sanitizeFileNameForS3Key } from "../../utils/helper";
import { Button } from "@wordpress/components";

type ImagePickerType = {
  onChange: (val: string) => void;
  label: string;
  setImageUploading?: any;
  tooltipText?: string;
  validationRequired?: boolean;
  disabled?: boolean;
  uploadedUrl?: string;
};

const ImagePicker = ({
  onChange,
  label,
  setImageUploading,
  tooltipText,
  validationRequired = false,
  disabled = false,
  uploadedUrl,
}: ImagePickerType) => {
  const [fileName, setFileName] = React.useState("Choose File");
  const [pickerId, setPickerId] = React.useState<string>();
  const [isLoading, setLoading] = React.useState(false);

  const [showErrorMessage, setShowErrorMessage] = React.useState("");
  const [validationError, setValidationError] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // this support only 16/9 aspect ratio image
  // const lowerRange = 1.7;
  // const upperRange = 1.9;
  // const requiredSizeKB = 8192;

  React.useEffect(() => {
    const image_id =
      "image_" +
      Math.floor(Math.random() * 10000) +
      "_" +
      Math.floor(Math.random() * 10000000);
    setPickerId(image_id);
  }, []);

  const uploadToS3 = async (file: File, url: any, md5: string) => {
    // console.log("upload");

    return new Promise(async (resolve, reject) => {
      // const formData = new FormData();
      // console.log("file", file);
      // formData.append("content-type", file.type);
      // formData.append("file", file);

      const buffer = await file.arrayBuffer();
      const blob = Buffer.from(buffer);

      // fetch(url, {
      //   method: "PUT",
      //   body: blob,
      //   headers: {"Content-Type": file.type, "Content-MD5"}
      // })

      axiosOriginal
        .put(url, blob, {
          headers: {
            "Content-MD5": btoa(md5),
            "Content-Type": file.type,
          },
        })
        .then((response) => {
          setImageUploading(false);
          resolve(response);
        })
        .catch((error) => {
          console.log("error", error);

          // if (isAxiosError(error)) {
          //   show({
          //     code: error.response?.status as number,
          //     ctx: XMLParser(error.response?.data)?.message || "",
          //   });
          // }
          reject(error);
        });
    });
  };

  async function calculateMd5(file: File) {
    const reader = new FileReader();
    const chunkSize = 1024 * 1024; // 1 MB chunks
    let currChunk = 0;
    const chunks = Math.ceil(file.size / chunkSize);
    const hasher = new SparkMd5.ArrayBuffer();

    function readNextChunk() {
      const start = currChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;

      reader.readAsArrayBuffer(file.slice(start, end));
    }

    reader.onload = async function (event) {
      //@ts-ignore
      hasher.append(event.target?.result);
      currChunk++;

      if (currChunk < chunks) {
        readNextChunk();
      } else {
        const md5 = hasher.end(true);
        // console.log(md5);

        let payload = {
          file_name: sanitizeFileNameForS3Key(file.name),
          content_md5: btoa(md5),
        };

        // store in database with md5 hash
        const res = await axios.post("/images", payload, {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        });
        // console.log("res", res);
        setFileName(file.name);
        onChange(res.data.key);

        // upload image to s3 bucket
        await uploadToS3(file, res.data?.upload_url, md5);
        Promise.resolve();
      }
    };

    // reader.onprogress = function () {
    //   setMD5Progress(
    //     Math.ceil((Math.ceil(currChunk * chunkSize) / file.size) * 100)
    //   );
    // };

    readNextChunk();
  }

  const handleImageApiCall = async (file: File) => {
    let imageFile = new FormData();
    imageFile.append("file", file);
    setLoading(true);
    try {
      //calculate md5
      await calculateMd5(file);
      setLoading(false);
      setImageUploading(true);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const handleImageSelection = async (
    e: React.ChangeEvent<HTMLFormElement | HTMLInputElement>,
  ) => {
    setShowErrorMessage("");
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    const file = chosenFiles[0];
    const validFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validFileTypes.includes(file.type)) {
      setShowErrorMessage("invalid-file-type");
      return;
    }

    const imgSize = chosenFiles[0].size;
    const imgSizeKB = chosenFiles[0].size / 1024;
    const fileReader = new FileReader();
    let imgwidth, imgheight, ratio;
    fileReader.onload = () => {
      const img = new Image();
      img.onload = () => {
        imgwidth = img.width;
        imgheight = img.height;
        ratio = imgwidth / imgheight;
        console.log("ratio", ratio);
        console.log("imgSizeKB", imgSizeKB);

        // if (validationRequired) {
        //   if (
        //     ratio >= (lowerRange as number) &&
        //     ratio <= (upperRange as number) &&
        //     imgSizeKB <= (requiredSizeKB as number)
        //   ) {
        //     handleImageApiCall(chosenFiles[0]);
        //     setValidationError(false);
        //   } else {
        //     setValidationError(true);
        //   }
        // } else {
        //   handleImageApiCall(chosenFiles[0]);
        //   setValidationError(false);
        // }

        handleImageApiCall(chosenFiles[0]);
      };
      img.src = fileReader.result as string;
    };
    if (chosenFiles[0]) {
      fileReader.readAsDataURL(chosenFiles[0]);
    }
  };

  const getFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const truncate = (text?: string, maxLength = 20): string => {
    if (!text) return ""; // safeguard
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          // marginBottom: "0.5rem",
        }}
      >
        <div
          style={{
            width: "50%",
            display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center",
            gap: "0.25rem",
            position: "relative",
          }}
        >
          <p className="body placeholder">{label}</p>
          {tooltipText && (
            <div
              style={{
                position: "relative",
              }}
            >
              <Tooltip text={tooltipText as string}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  info
                </span>
              </Tooltip>
            </div>
          )}
          {/* <div style={{ position: "relative" }}>
            {disabled && <Premium top="0%" />}
          </div> */}
        </div>

        <div className="imageUpload-main">
          <p className="label">
            {uploadedUrl
              ? truncate(getFileName(uploadedUrl))
              : truncate(fileName.replace(/\s/g, "_"))}
          </p>
          <label style={{ width: "100%" }} htmlFor={pickerId}>
            <Button
              __next40pxDefaultSize
              variant="primary"
              disabled={disabled}
              isBusy={isLoading}
              icon={"cloud-upload"}
              style={{
                width: "100%",
                justifyContent: "center",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedUrl ? "Change" : "Upload"}
            </Button>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id={pickerId}
            style={{ display: "none" }}
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={(e) => handleImageSelection(e)}
            disabled={disabled}
          />
        </div>
      </div>

      {showErrorMessage === "invalid-file-type" && (
        <div
          className="error-container"
          style={{
            marginBottom: "1rem",
          }}
        >
          <p className="error-text">Invalid file type</p>
        </div>
      )}

      {/* {validationError && (
        <div
          className="error-container"
          style={{
            marginBottom: "1rem",
          }}
        >
          <p className="error-text">
            Upload an 16/9 aspect ratio image and under {requiredSizeKB} KB.
          </p>
        </div>
      )} */}
    </div>
  );
};

export default ImagePicker;
