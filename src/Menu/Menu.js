import React from "react";
import {
  Link
} from "react-router-dom";

function Menu() {
  return (
    <nav className="menu" aria-label="Main Menu">
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    </nav>
  );
}

export default Menu;
