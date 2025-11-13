import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link } from "react-router-dom";
import "./Navbar.scss"
import Cart from "../Cart/Cart";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [open,setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const products = useSelector((state) => state.cart.products);

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="left">
          <div className="item">
            <img src="/img/en.png" alt="" />
            <KeyboardArrowDownIcon />
          </div>
          <div className="item">
            <span>USD</span>
            <KeyboardArrowDownIcon />
          </div>
          <div className="item">
            <Link className ="link" to="/products">Women</Link>
          </div>
          <div className="item">
            <Link className ="link" to="/products">Men</Link>
          </div>
          <div className="item">
            <Link className ="link" to="/products">Children</Link>
          </div>
        </div>
        <div className="center">
          <Link className ="link" to="/home">LAMASTORE</Link>
        </div>
        <div className={`right ${menuOpen ? 'open' : ''}`}>
          <div className="item">
            <Link className ="link" to="/">Homepage</Link>
          </div>
          <div className="item">
            <Link className ="link" to="/">About</Link>
          </div>
          <div className="item">
            <Link className ="link" to="/contact">Contact</Link>
          </div>
          <div className="item">
            <Link className ="link" to="/">Stores</Link>
          </div>
          <div className="icons">
            <SearchIcon/>
            <PersonOutlineOutlinedIcon/>
            <FavoriteBorderOutlinedIcon/>
            <div className="cartIcon" onClick={()=>setOpen(!open)}>
              <ShoppingCartOutlinedIcon/>
              <span>{products.length}</span>
            </div>
          </div>
          <div className="menuToggle" onClick={()=>setMenuOpen(!menuOpen)}>
            <div className={`bar ${menuOpen ? 'active' : ''}`}></div>
            <div className={`bar ${menuOpen ? 'active' : ''}`}></div>
            <div className={`bar ${menuOpen ? 'active' : ''}`}></div>
          </div>
        </div>
      </div>
      {open && <Cart/>}
    </div>
  );
};

export default Navbar;
