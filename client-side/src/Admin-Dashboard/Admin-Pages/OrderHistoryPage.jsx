import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from "dayjs";

export default function OrderHistoryPage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("Token");

  // If no token, redirect to authentication
  if (!token) {
    return <Navigate to="/authentication" />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/historyOrders`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
        console.log("Fetched all orderData for history:", response.data);

        const historyOrders = (response.data.orderData || []).filter(
          order => order.status === 'done' || order.status === 'cancelled' || order.status === 'cancel'
        );
        setData(historyOrders);
      } catch (error) {
        console.error("Error fetching history data:", error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return '#28a745';
      case 'cancelled':
      case 'cancel': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return '✅';
      case 'cancelled':
      case 'cancel': return '❌';
      default: return '📋';
    }
  };

  const formatOrderTime = (createdAt) => {
    return dayjs(createdAt).format('YYYY-MM-DD hh:mm A');
  };

  // New function to fetch and download the bill from the server
  const fetchAndDownloadBill = async (orderId) => {
    try {
      // Assuming a new server endpoint for generating a PDF bill
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/generate-bill/${orderId}`,
        {
          responseType: 'blob', // Important: response type must be 'blob' for file downloads
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Create a URL for the blob and a temporary link to download it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bill_Order_${orderId}.pdf`); // Set the filename
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up the temporary link
    } catch (error) {
      console.error("Error fetching bill from server:", error);
      // Implement a custom modal or message box for user feedback
    }
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          color: '#8B4513',
          margin: 0,
          fontSize: '1.8em'
        }}>📚 Order History</h2>
        <div style={{
          background: '#f8f9fa',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.9em',
          color: '#6c757d'
        }}>
          Total: {data.length} historical orders
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        paddingBottom: '20px',
        justifyContent: 'flex-start',
      }}>
        {Array.isArray(data) && data.length > 0 ? (
          [...data]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((order, index) => (
              <div
                key={order._id || index}
                style={{
                  height:"auto",
                  minWidth: '320px',
                  maxWidth: '320px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: `3px solid ${getStatusColor(order.status)}`,
                  padding: '20px',
                  position: 'relative',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '15px',
                  background: getStatusColor(order.status),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  fontSize: '0.8em',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {getStatusIcon(order.status)} {order.status}
                </div>

                {/* Order Header */}
                <div style={{
                  marginBottom: '15px',
                  paddingTop: '10px'
                }}>
                  <h3 style={{
                    margin: '0 0 5px 0',
                    color: '#2c2c2c',
                    fontSize: '1.2em'
                  }}>
                    Order #{index + 1}
                  </h3>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#6c757d',
                    fontSize: '0.9em'
                  }}>
                    <span>🏷️ Table {order.tableId}</span>
                    <span>🕐 {formatOrderTime(order.createdAt)}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div style={{
                  background: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}>
                  <strong style={{ color: '#8B4513' }}>👤 {order.customerName}</strong>
                  <br />
                  <small style={{ color: '#6c757d' }}>📞 {order.customerPhone}</small>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    color: '#495057',
                    fontSize: '1em'
                  }}>📝 Items:</h4>
                  <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    color: '#6c757d'
                  }}>
                    {order.items.map((item, itemIndex) => (
                      <li key={itemIndex} style={{ marginBottom: '4px' }}>
                        {item.itemName} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  padding: '10px',
                  background: '#e9ecef',
                  borderRadius: '6px'
                }}>
                  <strong style={{ color: '#8B4513' }}>Total:</strong>
                  <strong style={{
                    color: '#28a745',
                    fontSize: '1.2em'
                  }}>
                    ₹{order.totalPrice.toFixed(2)}
                  </strong>
                </div>

                {order.status === 'done' && (
                  <button
                    onClick={() => fetchAndDownloadBill(order._id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1em',
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
                  >
                    Generate Bill
                  </button>
                )}
              </div>
            ))
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '200px',
            color: '#6c757d',
            fontSize: '1.2em'
          }}>
            {data.length === 0 ? '📚 No historical orders available' : '⏳ Loading historical orders...'}
          </div>
        )}
      </div>
    </div>
  );
}
