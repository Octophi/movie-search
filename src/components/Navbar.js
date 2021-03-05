import React from "react";

// Basic navbar with logo, no additional links to include
export default function Navbar(props) {
  return (
    <nav className="navbar navbar-light bg-light" id="main-nav">
      <span className="navbar-brand">
        <div id="logo">
          <span>ff</span>
        </div>
        <span className="bold">flick</span>
        <span className="thin">findr</span>
      </span>
    </nav>
  );
}
