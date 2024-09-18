import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./Reviews.scss";
import { BiCaretDown, BiLoader } from "react-icons/bi";
const Reviews = ({ gigId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [errorResponseMessage, setErrorResponseMessage] = useState("");
  const [successResponseMessage, setSuccessResponseMessage] = useState("");
  const [spinner, setSpinner] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: async (review) => {
      try {
        let res = await newRequest.post("/reviews", review);
        if (res.status(201)) {
          console.log(res);
          setSuccessResponseMessage("Review Submitted");
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
      }
      // return
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
    },
  });

  const handleSubmit = async (e) => {
    setSpinner(true);
    e.preventDefault();
    const desc = e.target[0].value;
    const star = e.target[1].value;
    mutation.mutate({ gigId, desc, star });
  };

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {isLoading
        ? "loading"
        : error
        ? "Something went wrong!"
        : data.map((review) => <Review key={review._id} review={review} />)}
      <div className="add">
        <h3>Add a review</h3>
        <form action="" className="addForm" onSubmit={handleSubmit}>
          <input
            type="text"
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
            }}
            placeholder="write your opinion"
          />
          <p className="error">{errorResponseMessage}</p>
          <p className="success">{successResponseMessage}</p>
          <span>Select Rating</span>
          <span className="select">
            <select
              name=""
              id=""
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
              }}
            >
              <option value={1}>1 star </option>
              <option value={2}>2 stars</option>
              <option value={3}>3 stars</option>
              <option value={4}>4 stars</option>
              <option value={5}>5 stars</option>
            </select>
            <BiCaretDown className="dropdown-caret" />
          </span>

          <button type="submit">Send {spinner && <BiLoader />}</button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
