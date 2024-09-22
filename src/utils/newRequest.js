import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://cb-api-i6ne.onrender.com/",
  withCredentials: true,
});

export default newRequest;
