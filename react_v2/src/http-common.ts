import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_PPOTOCOL + "://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORT,
  headers: {
    "Content-type": "application/json",
  },
});