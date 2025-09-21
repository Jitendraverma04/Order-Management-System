import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../assets/CartContext.jsx";  
import axios from "axios";
import '../css-components/FoodItem.css';
import "../Media-queries/MediaQueries.css"

export default function CategoryItems() {
  const { categoryName } = useParams(); 
  const { cart, handleUpdateQuantity } = useCart(); 
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userside/getitems/${categoryName}`);
        setCategoryItems(response.data.items);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching items for ${categoryName}:`, err);
        setError(`Failed to load items for ${categoryName}.`);
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [categoryName]);

  if (loading) return <p>Loading {categoryName} items...</p>;
  if (error) return <p>{error}</p>;


  const formatItemDesc = (dec) => {
    if (typeof dec !== 'string') return "Unknown";
    const clean = dec.replace(/(<([^>]+)>)/gi, "");
    return clean.length > 70 ? `${clean.slice(0, 70)}...` : clean;
  };

  return (
    <div className="FoodItem-container">
      <h2 style={{ textTransform: "capitalize" }}>{categoryName} Menu</h2>
      <div className="FoodItem-list">
        {categoryItems.map((item) => {
          const cartItem = cart.find((cartItem) => cartItem._id === item._id);

          return (
            <div
              key={item._id}
              className={`FoodItem-card ${item.itemStatus === false ? 'disabled-category' : ''}`}
            >
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/${item.itemImage}`}
                alt={item.title}
                className="FoodItem-img"
              />
              <h3>{item.itemName}</h3>
              <h3>{formatItemDesc(item.description)}</h3>
              <h3><strong>Price: ${item.price.toFixed(2)}</strong></h3>

              {item.itemStatus === false ? (
                <>
                  <button className="add-to-cart-btn" disabled style={{ cursor: 'not-allowed' }}>
                    Not Available
                  </button>
                  <span className="not-available-badge">Unavailable</span>
                </>
              ) : cartItem ? (
                <div className="quantity-controls">
                  <button onClick={() => handleUpdateQuantity(item, -1)} className="qty-btn">-</button>
                  <span style={{ margin: "0 10px", color: 'black' }}>{cartItem.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item, 1)} className="qty-btn">+</button>
                </div>
              ) : (
                <button className="add-to-cart-btn" onClick={() => handleUpdateQuantity(item, 1)}>
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
