import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import Modal from "react-bootstrap/Modal";

const AddItem = (props) => {
  const [item, setItem] = useState("");
  const [startDate, setStartDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [auctionStartDate, setAuctionStartDate] = useState("");
  const [auctionEndDate, setAuctionEndDate] = useState("");
  const [productImage, setProductImage] = useState("");

  const clearForm = () => {
    setItem("");
    setStartDate("");
    setTitle("");
    setDescription("");
    setPrice("");
    setAuctionStartDate("");
    setAuctionEndDate("");
    setProductImage("");
  };
  /*
  const changeHandler = (event) => {
    const { name, value } = event.target;
    setItem((prevItem) => {
      return {
        ...prevItem,
        [name]: value,
      };
    });
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };
*/
  const fileChangeHandler = (event) => {
    setProductImage(event.target.files[0]);
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  const addUserItem = async (event) => {
    event.preventDefault();
    const newKey = uuid();
    /*
    let data = {
      key: newKey,
      id: newKey,
      title: item.title,
      bids: 0,
      price: item.price, //change to store in cents?
      highBidder: "",
      highBidderId: "",
      seller: props.loggedIn.username,
      sellerId: props.loggedIn.id,
      img: item.img,
      closeBidDateTime: "",
    };
    */
    const data = {
      startDate,
      title,
      description,
      price,
      auctionStartDate,
      auctionEndDate,
      productImage,
    };
    console.log("data");
    console.log(data);

    const formData = new FormData();

    formData.append("title", title);
    //bids: Number,
    formData.append("price", price);
    debugger;
    //const fileBytes = await toBase64(productImage);
    formData.append("product_picture", productImage);
    formData.append("auctionStartDate", auctionStartDate);
    formData.append("auctionEndDate", auctionEndDate);

    fetch("http://localhost:3001/add", {
      method: "POST",
      // "Content-Type": "Application/json",
      "content-type": "multipart/form-data",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        props.addItemHandler();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <Modal show={props.show} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Add Item To The Auction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={addUserItem}>
          <label htmlFor="title">Item Title</label>
          <input
            className="form-control"
            name="title"
            placeholder="item title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="mt-2">
            <label htmlFor="product_picture"> Add Image</label>
            <input
              className="form-control"
              accept="image/png, image/jpeg"
              type="file"
              name="product_picture"
              onChange={fileChangeHandler}
            />
            <label htmlFor="title">Initial price</label>
            <input
              className="form-control"
              type="number"
              name="price"
              placeholder="initial price"
              onChange={(e) => setPrice(e.target.value)}
            />

            <label htmlFor="startDate">Auction Start Date</label>
            <input
              className="form-control"
              type="datetime-local"
              name="auctionStartDate"
              onChange={(e) => setAuctionStartDate(e.target.value)}
            />

            <label htmlFor="endDate">Auction End Date</label>
            <input
              className="form-control"
              type="datetime-local"
              name="auctionStartDate"
              onChange={(e) => setAuctionEndDate(e.target.value)}
            />
            <textarea
              className="form-control"
              name="desc"
              placeholder="Description"
              rows="3"
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              className="btn btn-primary mt-4"
              style={{ marginRight: 10 }}
            >
              Add Item
            </button>
            <button
              type="button"
              className="btn btn-primary mt-4 mr-10"
              onClick={clearForm}
            >
              Clear Form
            </button>
            <button
              type="button"
              className="btn btn-primary mt-4 "
              onClick={props.toggle}
            >
              Close
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddItem;
