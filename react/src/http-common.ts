import axios from "axios";

export default axios.create({
  baseURL: "http://194.87.147.163:1337",
  headers: {
    "Content-type": "application/json",
  },
});