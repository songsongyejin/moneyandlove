import React, { useState } from "react";
import "./style.css";

const FreindsSideBar: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);

  const handleMenuClick = () => {
    setNavOpen(!navOpen);
  };
  return (
    <nav className={`fNav ${navOpen ? "nav-open" : ""}`}>
      <div className="menu-btn w-8" onClick={handleMenuClick}>
        <div className={`line line--1 ${navOpen ? "line-cross" : ""}`}></div>
        <div className={`line line--2 ${navOpen ? "line-fade-out" : ""}`}></div>
        <div className={`line line--3 ${navOpen ? "line-cross" : ""}`}></div>
      </div>
      <div
        className={`nav-links ${navOpen ? "fade-in" : ""} text-6xl font-bold text-white`}
      >
        친 구 목 록
      </div>
    </nav>
  );
};

export default FreindsSideBar;
