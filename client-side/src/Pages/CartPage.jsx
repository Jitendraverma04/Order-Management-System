




import { useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../assets/CartContext.jsx";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


export default function CartPage() {
  const { tableId } = useParams();
  const { cart, handleUpdateQuantity,clearCart } = useCart();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // console.log("cart",cart);

  const totalCartPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
   useEffect(() => {
     if (cart.length === 0) {
       setTimeout(() => navigate(-1),1000); 
     }
   }, [cart]);

  const handleSubmit = () => {
    if (cart.length === 0) return;

    const orderData = {
      customerName,
      customerPhone,
      tableId,
      items: cart,
      totalPrice: totalCartPrice,
    };

    console.log("ordered Data before :",orderData)
    setSelectedProduct(orderData);
  };

  const confirmOrder = async () => {
    if (!customerName || !customerPhone) {
      alert("Please enter your details before confirming the order.");
      return;
    }
  
    const UpdatedOrderData = {
      customerName,
      customerPhone,
      tableId,
      items: cart,
      totalPrice: totalCartPrice,
    };
  
    
    console.log("ordered Data after :",UpdatedOrderData);

    try {
      const response = await fetch((`${import.meta.env.VITE_SERVER_URL}/userside/confirmOrder`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(UpdatedOrderData),
      });
  
      if (response.ok) {
          (toast.success("Order placed successfully!", {
         position: "top-right",
         autoClose: 2500,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "light",
       }));
       clearCart();
       setSelectedProduct("");
      navigate(`/order/${tableId}/menu`);
      }
     else {
      toast.error("Order Does Not Placed!", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      clearCart();
      setSelectedProduct("");
     navigate(`/order/${tableId}/menu`);
  }
    } catch (error) {
      toast.error("ERROR OCCURED", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      
      clearCart();
      setSelectedProduct("");
     navigate(`/order/${tableId}/menu`);
    }
  };
  

  return (
    <div style={{ textAlign: "center", padding: "0px",background:'#FFFFFF' }}>

<div className="FoodItem-container" style={{}}>
<div className="FoodItem-list" style={{}}>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px",
          width: "100%",
          margin: "auto",
          color:'black',
        }}
      >
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          cart.map((item) => (
            <div key={item._id}
          style={{display:'flex',justifyContent:'space-between',gap:'1rem',margin:'1rem 0',width:'auto'}}>
              
              <div style={{width:'30vw'}}><h3>
              {item.itemName} - ${item.price} x {item.quantity}
              </h3></div>

              <div className="quantity-controls" style={{textAlign:"center",justifyContent:"space-evenly"}}>
                  <button onClick={() => handleUpdateQuantity(item, -1)} className="qty-btn" style={{}}>-</button>
                  <span style={{ margin: "0 10px", color: 'black' }}>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item, 1)} className="qty-btn" style={{}}>+</button>
                </div>
            </div>
          ))
        )}

        <h3 style={{padding:"1rem"}}>Total: ${totalCartPrice}</h3>

        <button onClick={handleSubmit} style={buttonStyle("green")}>
          Order Now
        </button>
        <button
          onClick={() =>navigate(`/order/${tableId}/menu`)}
          style={buttonStyle("red")}
        >
          Cancel
        </button>

            
      </div>

      {selectedProduct && (
        <div style={modalStyle}>
          <h2> Table Id: {tableId}</h2>
          <p>Please enter your name and phone number below</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              confirmOrder();
            }}
          >
            <label>Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              style={inputStyle}
            />
            <label>Phone:</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle("blue")}>
              Confirm Order
            </button>
          </form>

          <button
            onClick={() => setSelectedProduct(null)}
            style={{ marginTop: "10px", padding: "5px", width: "100%" }}
          >
            Cancel
          </button>
        </div>
      )}
      </div>
      </div>


    </div>
  );
}

const buttonStyle = (color) => ({
  background: color,
  color: "white",
  padding: "1vw",
  margin: "0 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
});

const inputStyle = {
  width: "100%",
  padding: "5px",
  marginBottom: "10px",
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "grey",
  padding: "20px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  borderRadius: "10px",
  width: "300px",
};
