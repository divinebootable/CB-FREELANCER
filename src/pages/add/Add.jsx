import React, { useEffect, useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { BiLoader } from "react-icons/bi";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [coverImg, setCoverImg] = useState("");
  const [uploadImgs, setUploadImgs] = useState([]);
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const [spinner, setSpinner] = useState(false);
  const [errorResponseMessage, setErrorResponseMessage] = useState("");
  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      try {
        let res = newRequest.post("/gigs", gig);
        if (res.status === 200) {
          console.log(res);
          setSpinner(false);
        }
      } catch (error) {
        let message = error.response.data;
        let status = error.status;
        if (status === 403) {
          setErrorResponseMessage(message);
          consosle.log(message);
          return;
        }
        console.log(error);
        setSpinner(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e) => {
    setSpinner(true);
    e.preventDefault();
    mutation.mutate(state);
    // navigate("/mygigs")
  };
  useEffect(() => {}, [uploadImgs]);
  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              required
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <div className="selected-img">
                  <img src={coverImg} />
                </div>
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    setSingleFile(e.target.files[0]);
                    setCoverImg(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <label htmlFor="">Upload Images</label>
                {uploadImgs && uploadImgs.map((file) => {})}
                <div className="selected-imgs">
                  {uploadImgs && uploadImgs.map((file) => <img src={file} />)}
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    setFiles(e.target.files);
                    let tempFiles = [...e.target.files];
                    setUploadImgs([
                      ...tempFiles.map((file) => {
                        return URL.createObjectURL(file);
                      }),
                    ]);
                    // setUploadImgs(e.target.files);
                  }}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              required
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              required
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              required
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input
              type="number"
              onChange={handleChange}
              required
              placeholder="$750"
              name="price"
            />
          </div>
        </div>
        <p className="error">{errorResponseMessage}</p>
        <button onClick={handleSubmit} className="button">
          Create {spinner && <BiLoader />}
        </button>
      </div>
    </div>
  );
};

export default Add;
