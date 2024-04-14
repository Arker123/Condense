import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../../redux/userSlice";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Navbar.css";

function Navbar() {
  const user = useSelector((state) => state.user);
  AOS.init();
  const dispatch = useDispatch();

  return (
    <div>
      <header className="App-header">
        <div className="logo">
          <img src="/images/white-logo.svg" alt="Logo" />
        </div>
        <nav className="navbar">
          <ul>
            <li>
              <a href="/landing">
                <FontAwesomeIcon icon={faHome} />
              </a>
            </li>
            <li>
              <a href="#extension">Chrome Extension</a>
            </li>
            <li>
              <a href="/dashboard">Youtube Summaries</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
        <div className="user-actions">
          {user.email ? (
            <div className="login-signup-button rounded-full">
              <button onClick={() => dispatch(logout())}>Logout</button>
            </div>
          ) : (
            <div className="login-signup-button rounded-full">
              <Link to="/signup">Login/SignUp</Link>
            </div>
          )}
        </div>
      </header>{" "}
      <br />
      <br />
      <br />
    </div>
  );
}

export default Navbar;
