import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from "dayjs";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [animatingOrderId, setAnimatingOrderId] = useState(null);
  // const navigate = useNavigate();

  const token = localStorage.getItem("Token");

  // if (!token) {
  //   return <Navigate to="/authentication" />;
  // }

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/historyOrders`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

      console.log("Fetched all orderData:", response.data.orderData);
      const pendingOrders = (response.data.orderData || []).filter(
        order => order.status === 'pending'
      );
      setData(pendingOrders);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); 
    }
  };
  useEffect(() => {
    fetchData();
  }, []); 

  const updateOrderStatus = async (orderId, newStatus) => {
    // Store the original status for potential rollback
    const originalOrder = data.find(order => order._id === orderId);
    const originalStatus = originalOrder ? originalOrder.status : null;

    setData(prevData =>
      prevData.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    setAnimatingOrderId(orderId);

    setTimeout(async () => {
      try {
        await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/updateOrderStatus`, 
          {
          orderId,
          status: newStatus
        },  
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`Order ${orderId} status updated to ${newStatus} on server.`);
        fetchData(); // Re-fetch data after successful update and animation
      } catch (error) {
        console.error("Error updating order status:", error);
        // Revert the local state change if API call fails
        if (originalStatus) {
          setData(prevData =>
            prevData.map(order =>
              order._id === orderId ? { ...order, status: originalStatus } : order
            )
          );
        }
        alert("Failed to update order status. Please try again.");
      } finally {
        setAnimatingOrderId(null); 
      }
    }, 1000); 
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      case 'cancel': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return '✅';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      case 'cancel': return '❌';
      default: return '📋';
    }
  };

  const formatOrderTime = (createdAt) => {
    return dayjs(createdAt).format('hh:mm A');
  };

  const formatItems = (items) => {
    return items.map(item => `${item.itemName} × ${item.quantity}`);
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Inter, sans-serif' 
    }}>
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          position: "fixed",
          color: '#8B4513',
          margin: 0,
          fontSize: '1.8em'
        }}>☕ Active Orders</h2>
        <div style={{
          position: "fixed",
          right: "2rem",
          background: '#f8f9fa',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.9em',
          color: '#6c757d'
        }}>
          Total: {data.length} orders
        </div>
      </div>

      <div style={{
        padding: "1rem",
        marginTop: "3rem",
        display: 'flex',
        overflowX: 'auto',
        // alignItems:"flex-start",
        gap: '20px',
        paddingBottom: '20px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#8B4513 #f1f1f1'
      }}>
        {Array.isArray(data) && data.length > 0 ? (
          [...data]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((order, index) => (
              <div
                key={order._id || index}
                style={{
                  minWidth: '320px',
                  maxWidth: '320px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: `3px solid ${getStatusColor(order.status)}`,
                  padding: '20px',
                  position: 'relative',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  animation: animatingOrderId === order._id ? 'status-change-pulse 2s forwards' : 'none',
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

                <div style={{
                  background: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}>
                  <strong style={{ color: '#8B4513',wordBreak: 'break-word' }}>� {order.customerName}</strong>
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
                        {item.itemName} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>

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
                    ${order.totalPrice.toFixed(2)}
                  </strong>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => updateOrderStatus(order._id, 'done')}
                    disabled={order.status === 'done' || animatingOrderId === order._id} 
                    style={{
                      flex: 1,
                      background: order.status === 'done' ? '#28a745' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '10px 8px',
                      borderRadius: '6px',
                      cursor: (order.status === 'done' || animatingOrderId === order._id) ? 'not-allowed' : 'pointer',
                      fontSize: '0.9em',
                      fontWeight: 'bold',
                      transition: 'background 0.3s ease',
                      opacity: (order.status === 'done' || animatingOrderId === order._id) ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (order.status !== 'done' && animatingOrderId !== order._id) {
                        e.target.style.background = '#28a745';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (order.status !== 'done' && animatingOrderId !== order._id) {
                        e.target.style.background = '#6c757d';
                      }
                    }}
                  >
                    ✅ Done
                  </button>

                  <button
                    onClick={() => updateOrderStatus(order._id, 'pending')}
                    disabled={order.status === 'pending' || animatingOrderId === order._id}
                    style={{
                      flex: 1,
                      background: order.status === 'pending' ? '#ffc107' : '#6c757d',
                      color: order.status === 'pending' ? '#000' : 'white',
                      border: 'none',
                      padding: '10px 8px',
                      borderRadius: '6px',
                      cursor: (order.status === 'pending' || animatingOrderId === order._id) ? 'not-allowed' : 'pointer',
                      fontSize: '0.9em',
                      fontWeight: 'bold',
                      transition: 'background 0.3s ease',
                      opacity: (order.status === 'pending' || animatingOrderId === order._id) ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (order.status !== 'pending' && animatingOrderId !== order._id) {
                        e.target.style.background = '#ffc107';
                        e.target.style.color = '#000';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (order.status !== 'pending' && animatingOrderId !== order._id) {
                        e.target.style.background = '#6c757d';
                        e.target.style.color = 'white';
                      }
                    }}
                  >
                    ⏳ Pending
                  </button>

                  <button
                    onClick={() => updateOrderStatus(order._id, 'cancelled')}
                    disabled={order.status === 'cancelled' || order.status === 'cancel' || animatingOrderId === order._id} // Disable during animation
                    style={{
                      flex: 1,
                      background: (order.status === 'cancelled' || order.status === 'cancel') ? '#dc3545' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '10px 8px',
                      borderRadius: '6px',
                      cursor: (order.status === 'cancelled' || order.status === 'cancel' || animatingOrderId === order._id) ? 'not-allowed' : 'pointer',
                      fontSize: '0.9em',
                      fontWeight: 'bold',
                      transition: 'background 0.3s ease',
                      opacity: (order.status === 'cancelled' || order.status === 'cancel' || animatingOrderId === order._id) ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (order.status !== 'cancelled' && order.status !== 'cancel' && animatingOrderId !== order._id) {
                        e.target.style.background = '#dc3545';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (order.status !== 'cancelled' && order.status !== 'cancel' && animatingOrderId !== order._id) {
                        e.target.style.background = '#6c757d';
                      }
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
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
            {data.length === 0 ? '📋 No orders available' : '⏳ Loading orders...'}
          </div>
        )}
      </div>

      <style>{`
        div::-webkit-scrollbar {
          height: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: #8B4513;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #A0522D;
        }

        /* Keyframes for status change animation */
        @keyframes status-change-pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-color: inherit; /* Use existing border color */
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            border-color: #4CAF50; /* A vibrant color during pulse */
          }
          100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-color: inherit; /* Revert to existing border color */
          }
        }

        /* Apply animation to the order card when status is changing */
        .status-changing {
          animation: status-change-pulse 2s forwards;
        }
      `}</style>
    </div>
  );
}
