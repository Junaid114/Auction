import React, { useCallback, useEffect, useState } from "react";
import AddItem from "./AddItem";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

const Navbar = (props) => {
  const [showRegistrationFrom, setShowRegistrationFrom] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = useState(null);
  const closeRegistrationFrom = useCallback(() => {
    setShowRegistrationFrom((prev) => !prev);
  }, []);

  const closeLoginFrom = useCallback(() => {
    setShowLoginForm((prev) => !prev);
  }, []);
  useEffect(() => {
    debugger;
    const loggedUser = localStorage.getItem("user");
    if (loggedUser !== null) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);
  const logout = () => {
    setUser(null);
    localStorage.setItem("user", null);
  };
  const login = useCallback((data) => {
    if (data !== null) {
      setUser(data);
    }
  }, []);
  return (
    <div>
      <nav className="navbar navbar-brand-center sticky-top navbar-expand-lg navbar-dark ">
        <div className="container">
          <a className="navbar-brand fs-2 text-light" href="/">
            AUCTION APP <i className="fa-solid fa-gavel"></i>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="">
              <i className="text-light fa-solid fa-circle-chevron-down fa-lg"></i>
            </span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {props.user && (
                <li
                  className="nav-item"
                  data-bs-toggle="modal"
                  data-bs-target="#addModal"
                >
                  <a className="btn nav-link text-light">Add Item</a>
                </li>
              )}

              {user !== null ? (
                <button className="btn nav-link text-light" onClick={logout}>
                  {user?.username}
                </button>
              ) : (
                <>
                  {" "}
                  <li
                    className="nav-item"
                    data-bs-toggle="modal"
                    data-bs-target="#registerModal"
                  >
                    <button
                      className="btn nav-link text-light"
                      onClick={() => setShowRegistrationFrom((prev) => !prev)}
                    >
                      Register
                    </button>
                  </li>
                  <li
                    className="nav-item"
                    data-bs-toggle="modal"
                    data-bs-target="#registerModal"
                  >
                    <button
                      className="btn nav-link text-light"
                      onClick={() => setShowLoginForm((prev) => !prev)}
                    >
                      SignIn
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* MODALS */}
      <RegisterForm
        toggle={closeRegistrationFrom}
        show={showRegistrationFrom}
      />
      <LoginForm
        toggle={closeLoginFrom}
        show={showLoginForm}
        loginHandler={login}
      />
      <AddItem loggedIn={props.user} />
    </div>
  );
};

export default Navbar;
