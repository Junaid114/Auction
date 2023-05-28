import React, { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";

const LoginForm = (props) => {
  const [loginData, setLoginData] = useState("");

  const [show, setShow] = useState(props.show);
  const handleClose = () => setShow(false);
  const loginChangeHandler = (event) => {
    let { name, value } = event.target;
    setLoginData((prevItem) => {
      return {
        ...prevItem,
        [name]: value,
      };
    });
    // console.log(loginData);
  };

  const loginHandler = (event) => {
    event.preventDefault();

    if (loginData.username && loginData.password) {
      fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data));
          console.log("Success:", data);
          props.loginHandler(data);
          props.toggle();
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      alert("Please fill in both username and password to login");
      event.preventDefault();
    }
  };

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>Welcome to the Auction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={loginHandler}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              className="form-control"
              name="username"
              placeholder=""
              onChange={loginChangeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              type="password"
              className="form-control"
              name="password"
              placeholder=""
              onChange={loginChangeHandler}
            />
          </div>
          <div className="d-grid gap-2 mt-4 ">
            <button type="submit" className="btn btn-outline-dark ">
              Sign In
            </button>
          </div>
          <div className="d-grid gap-2 mt-4 mb-4">
            <button
              type="button"
              className="btn btn-outline-dark"
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

export default LoginForm;
