import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();
  const [gigs, setGigs] = useState([]);
  const { search } = useLocation();

  const dummyData = [
    {
      _id: "1",
      title: "Dummy Gig 1",
      description: "This is a dummy gig description.",
    },
    {
      _id: "2",
      title: "Dummy Gig 2",
      description: "This is another dummy gig description.",
    },
  ];

  const fetchAllGigs = async () => {
    try {
      let res = await newRequest.get("/gigs");
      if (res) {
        console.log(res);
        setGigs(res.data);
      }
    } catch (error) {
      console.log(error);
      setGigs(dummyData); // Set dummy data when error occurs
    }
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.log("Error fetching gigs: ", error);
          return dummyData; // Return dummy data if the request fails
        }),
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  useEffect(() => {
    fetchAllGigs();
  }, []);

  const apply = () => {
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">CB. Graphics & Design </span>
        <h1>AI Artists</h1>
        <p>
          Explore the boundaries of art and technology with Liverr's AI artists
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <div>
              <input ref={minRef} type="number" placeholder="min" />
              <input ref={maxRef} type="number" placeholder="max" />
            </div>
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                <span onClick={() => reSort("sales")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong!"
            : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
        <div className="gig-card-container">
          {gigs.map((gig) => (
            <GigCard key={gig._id} item={gig}></GigCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
