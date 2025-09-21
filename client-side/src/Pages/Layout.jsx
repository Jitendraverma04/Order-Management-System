import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

import { useCart } from "../assets/CartContext.jsx";
import Header from "./Header";
import '../Media-queries/MediaQueries.css'

export default function Layout() {

  const { cart } = useCart();
  const navigate = useNavigate();

  const { tableId} = useParams();


  

  return (
    <div>
      <div
        className="header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
        }}
      >
        <Header />
      </div>


      <div className="main-content"

        style={{
          position: "fixed",
          top: "5rem",
          padding:"0",
          left: 0,
          width:'100%',
          background:'#FFFFFF',
          marginLeft:"0",
        }} >
        <Outlet />
      </div>


      {cart.length > 0 && (

        <button
          onClick={() =>
             navigate(`/order/${tableId}/cart`, { state: { cart } })}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "orange",
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            width: '10rem'
          }}
        >
          🛒 View Cart
           {/* ({cart.length}) */}
        </button>
      )};

    </div>
  );
}
