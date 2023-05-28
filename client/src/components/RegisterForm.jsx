import React, { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";

const RegisterForm = (props) => {
  const [loginData, setLoginData] = useState("");
  const [registerData, setRegisterData] = useState("");
  const modalRef = useRef();
  const [show, setShow] = useState(props.show);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // const [passcheck, setPasscheck] = useState(false);

  const registerChangeHandler = (event) => {
    let { name, value } = event.target;
    setRegisterData((prevItem) => {
      return {
        ...prevItem,
        [name]: value,
      };
    });
  };

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

  const registerHandler = (event) => {
    event.preventDefault();
    if (registerData.username && registerData.password) {
      if (registerData.password === registerData.passwordcheck) {
        if (validateEmail) {
          let newUser = {
            username: registerData.username,
            password: registerData.password,
          };

          fetch("http://localhost:3001/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          })
            .then((response) => {
              debugger;

              if (response.status === 409) {
                alert(`${registerData.username} already exists.`);
              }
              response.json();
            })
            .then((data) => {
              console.log("Success:", data);
            })
            .catch((error) => {
              alert(error.message);
              console.log(error);
            });
        } else {
          alert("That is not a valid email, try again.");
          event.preventDefault();
        }
      } else {
        alert("Passwords do not match, please re-enter");
        event.preventDefault();
      }
    } else {
      alert("Please fill in both username and password(x2) to register");
      event.preventDefault();
    }
  };

  const loginHandler = (event) => {
    event.preventDefault();
    console.log(modalRef);
    //modalRef.current.close();

    if (loginData.username && loginData.password) {
      fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("user", data);
          console.log("Success:", data);
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
        <form onSubmit={registerHandler}>
          <div className="form-group ">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              className="form-control"
              name="username"
              placeholder=""
              onChange={registerChangeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              type="password"
              className="form-control"
              name="password"
              placeholder=""
              onChange={registerChangeHandler}
            />
            <label htmlFor="passwordcheck">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="passwordcheck"
              placeholder=""
              onChange={registerChangeHandler}
            />
          </div>
          <div className="d-grid gap-2 mt-4 mb-4">
            <button type="submit" className="btn btn-outline-dark ">
              Create Account
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

export default RegisterForm;
