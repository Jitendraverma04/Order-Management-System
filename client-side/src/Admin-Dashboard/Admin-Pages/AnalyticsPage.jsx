import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { CSVLink } from "react-csv";
import '../Css-components/Analytics.css';
import "react-datepicker/dist/react-datepicker.css";

export default function Analytics() {
  const [data, setData] = useState({ totalRevenue: 0, totalOrders: 0, topItem: "N/A" });
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("today");
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");


  const token = localStorage.getItem('Token');

  
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    let url = `${import.meta.env.VITE_SERVER_URL}/analytics`;
    const params = new URLSearchParams();

    let startDate, endDate;
    let calculatedDays = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "today":
        startDate = today;
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        calculatedDays = 1;
        break;
      case "yesterday":
        startDate = subDays(today, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        calculatedDays = 1;
        break;
      case "this_week":
        startDate = startOfWeek(today, { weekStartsOn: 1 });
        endDate = endOfWeek(today, { weekStartsOn: 1 });
        endDate.setHours(23, 59, 59, 999);
        calculatedDays = differenceInDays(endDate, startDate) + 1;
        break;
      case "this_month":
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        endDate.setHours(23, 59, 59, 999);
        calculatedDays = differenceInDays(endDate, startDate) + 1;
        break;
      case "custom":
        if (customStart && customEnd) {
          startDate = customStart;
          endDate = customEnd;
          endDate.setHours(23, 59, 59, 999);
          calculatedDays = differenceInDays(endDate, startDate) + 1;
        } else {
          setLoading(false);
          setNumberOfDays(0);
          return;
        }
        break;
      default:
        startDate = today;
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        calculatedDays = 1;
    }

    setNumberOfDays(calculatedDays);

    params.append("start", format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"));
    params.append("end", format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"));

    try {
      const res = await axios.get(`${url}?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
      setData(res.data.summary);
      setOrders(res.data.orders);
      setChartData(res.data.dailyBreakdown);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to fetch analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [filter, customStart, customEnd]);

  useEffect(() => {
    if (filter !== "custom") {
      setCustomStart(null);
      setCustomEnd(null);
    }
  }, [filter]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortColumn) {
      const aValue = sortColumn === 'createdAt' ? new Date(a[sortColumn]) : a[sortColumn];
      const bValue = sortColumn === 'createdAt' ? new Date(b[sortColumn]) : b[sortColumn];

      if (typeof aValue === 'string') {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      }
    }
    return 0;
  });



  return (
    <div className="analytics-container">
      <h2 className="analytics-title">📊 Analytics Dashboard</h2>

      <div className="filter-section">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {filter === "custom" && (
          <div className="custom-date-pickers">
            <DatePicker
              selected={customStart}
              onChange={(date) => setCustomStart(date)}
              selectsStart
              startDate={customStart}
              endDate={customEnd}
              placeholderText="Start Date"
              dateFormat="dd/MM/yyyy"
              className="date-picker"
            />
            <DatePicker
              selected={customEnd}
              onChange={(date) => setCustomEnd(date)}
              selectsEnd
              startDate={customStart}
              endDate={customEnd}
              minDate={customStart}
              placeholderText="End Date"
              dateFormat="dd/MM/yyyy"
              className="date-picker"
            />
          </div>
        )}
      </div>

      {loading && <div className="loading-message">Loading analytics...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <>
          <div className="cards-container">
            <div className="analytics-card">
              <h3>💰 Revenue</h3>
              <p>₹{data.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="analytics-card">
              <h3>🧾 Orders</h3>
              <p>{data.totalOrders}</p>
            </div>
            <div className="analytics-card">
              <h3>🔥 Top Item</h3>
              <p>{data.topItem}</p>
            </div>
            {filter !== "today" && filter !== "yesterday" && numberOfDays > 0 && (
              <div className="analytics-card days-count">
                <h3>🗓️ Days</h3>
                <p>{numberOfDays}</p>
              </div>
            )}
          </div>

          <div className="chart-section">
            <h2 className="analytics-title">📈 Revenue Trend</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data-message">No revenue data for the selected period.</p>
            )}
          </div>

          <div className="table-section">
            <div className="table-header">
              <h3>🧾 Orders List</h3>
              <div className="table-controls">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <CSVLink
                  data={sortedOrders.map(order => ({
                    OrderID: order._id,
                    Date: format(new Date(order.createdAt), "dd/MM/yyyy"),
                    Time: format(new Date(order.createdAt), "HH:mm"),
                    Customer: order.customerName,
                    Phone: order.customerPhone,
                    Total: order.totalPrice,
                    Status: order.status,
                    Items: order.items.map(item => `${item.itemName} (x${item.quantity})`).join(", ")
                  }))}
                  filename={`orders_${filter}_${format(customStart || new Date(), 'yyyyMMdd')}_${format(customEnd || new Date(), 'yyyyMMdd')}.csv`}
                  className="download-button"
                >
                  Export as CSV
                </CSVLink>
              </div>
            </div>
            {sortedOrders.length > 0 ? (
              <table>
                <thead>
                  <tr>

                    <th>
                      Order ID
                    </th>

                    <th onClick={() => handleSort('createdAt')} className={sortColumn === 'createdAt' ? `sorted ${sortDirection}` : ''}>
                      Date {sortColumn === 'createdAt' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th>Time</th>
                    <th onClick={() => handleSort('customerName')} className={sortColumn === 'customerName' ? `sorted ${sortDirection}` : ''}>
                      Customer {sortColumn === 'customerName' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th>
                      Phone
                    </th>
                    <th onClick={() => handleSort('totalPrice')} className={sortColumn === 'totalPrice' ? `sorted ${sortDirection}` : ''}>
                      Total {sortColumn === 'totalPrice' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{format(new Date(order.createdAt), "dd/MM/yyyy")}</td>
                      <td>{format(new Date(order.createdAt), "HH:mm")}</td>
                      <td>{order.customerName}</td>
                      <td>{order.customerPhone}</td>
                      <td>₹{order.totalPrice.toFixed(2)}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data-message">No orders found for the selected period.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
