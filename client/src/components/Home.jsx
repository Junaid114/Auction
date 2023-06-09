import React, { useState, useEffect } from "react";
import AuctionItem from "./AuctionItem";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TimeLeft from "./TimeLeft";
import { Routes, Route } from "react-router-dom";

const Home = () => {
  //
  // const closeDate = new Date(2022, 6, 15, 14, 0, 0);
  //

  const [items, setItems] = useState([]);
  const [loggedIn, setLoggedIn] = useState();
  console.log(loggedIn);

  const getAll = () => {
    fetch("http://localhost:3001/all")
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  //candidate for useEffect?
  const isLoggedIn = () => {
    // fetch('http://localhost:3001/loggedin')
    //   .then((res) => res.json())
    //   .then((data) => setLoggedIn(data));
    const user = localStorage.getItem("user");
    if (user !== null) {
      setLoggedIn(JSON.parse(user));
    }
  };

  useEffect(() => {
    getAll();
    isLoggedIn();
  }, []);

  const sendBid = (itemID) => {
    let newBid = items.filter((items) => items.id === itemID);
    console.log(newBid);
    const { bids, price } = newBid[0];
    let increase = 0;

    switch (true) {
      case price < 10:
        increase = 1;
        break;
      case price < 50:
        increase = 2;
        break;
      case price < 100:
        increase = 5;
        break;
      case price < 500:
        increase = 10;
        break;
      case price < 1000:
        increase = 25;
        break;
      case price < 10000:
        increase = 100;
        break;
      default:
        increase = 500;
    }

    let updatedBid = {
      bids: bids + 1,
      price: price + increase,
      id: itemID,
      highBidderID: loggedIn.id,
    };

    fetch("http://localhost:3001/bid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBid),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        getAll(); //this makes it refresh immediately - ok tho?
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const deleteItem = (id) => {
    fetch("http://localhost:3001/delete", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: id,
    })
      .then((response) => response)
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    getAll();
  };

  return (
    <>
      <div className="container ">
        <div className="container">
          <h4 className="text-center">Auction begins at:</h4>
          <h5 className="text-center">{""}</h5>
        </div>

        <div className="row ">
          {items
            .map((item, index) => (
              <AuctionItem
                key={item.key}
                id={item.id}
                title={item.title}
                bids={item.bids}
                price={item.price}
                highBidder={item.bids}
                highBidderId={item.highBidderId}
                seller={item.seller}
                sellerId={item.sellerId}
                closeDate={""}
                img={item.img}
                index={index}
                sendBid={sendBid}
                deleteItem={deleteItem}
                user={loggedIn}
              />
            ))
            .sort()}
        </div>
      </div>
    </>
  );
};

export default Home;
