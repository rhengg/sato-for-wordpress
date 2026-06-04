import axios from "axios";
import config from "../config";

const instance = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true
});

export default instance;
