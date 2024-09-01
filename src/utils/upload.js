import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "CBSERVICE");
  data.append("cloud_name", "db6ai2h5o");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/db6ai2h5o/image/upload",
      data
    );

    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
};

export default upload;
