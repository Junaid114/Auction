import React, { useState, useEffect } from 'react';
import AuctionItem from './AuctionItem';
import Navbar from './Navbar';
import Footer from './Footer';
import AddItem from './AddItem';
import TimeLeft from './TimeLeft';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
const App = () => {
  //
  // const closeDate = new Date(2022, 6, 15, 14, 0, 0);
  //

  const [items, setItems] = useState([]);
  const [loggedIn, setLoggedIn] = useState();
  console.log(loggedIn);

  const getAll = () => {
    fetch('http://localhost:3001/all')
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  //candidate for useEffect?
  const isLoggedIn = () => !!localStorage.getItem('user');

  useEffect(() => {
    getAll();
    isLoggedIn();
  }, []);

  const sendBid = (itemID) => {
    let newBid = items.filter((items) => items.id === itemID);
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

    fetch('http://localhost:3001/bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBid),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        getAll(); //this makes it refresh immediately - ok tho?
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  const deleteItem = (id) => {
    fetch('http://localhost:3001/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: id,
    })
      .then((response) => response)
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
    getAll();
  };

  return (
    <div>
      <Navbar user={loggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/add" element={<AddItem />} /> */}
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
