import React, { useEffect } from 'react'; 
import "../Css-components/AdminLayoutPage.css";
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = localStorage.getItem("Token");
    if (!data) {
      navigate("/authentication", { replace: true });
    }
  }, [navigate]);

  // const handleCustomChange = (e) => {
  //   const selectedValue = e.target.value;
  //   setCustomize(selectedValue);

  //   if (selectedValue) {
  //     navigate(selectedValue);
  //   }
  // };

  // useEffect(() => {
  //   if (location.pathname.includes("additem")) {
  //     setCustomize("additem");
  //   } else if (location.pathname.includes("newtable")) {
  //     setCustomize("newtable");
  //   } else if (location.pathname.includes("editItem")) {
  //     setCustomize("editItem");
  //   } else {
  //     setCustomize("");
  //   }
  // }, [location.pathname]);
  
  
  return (
    <div className="admin-layout-wrapper">
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="dashboard" className={location.pathname.includes("dashboard") ? "active" : ""}>
                <i className="fas fa-tachometer-alt"></i> Dashboard {/* Example icon */}
              </Link>
            </li>
           
            <li>
              <Link to="analytics" className={location.pathname.includes("analytics") ? "active" : ""}>
                <i className="fas fa-chart-line"></i> Analytics
              </Link>
            </li>

            <li>
              <Link to="customize" className={location.pathname.includes("customize") ? "active" : ""}>
                <i className="fas fa-chart-line"></i> Customize
              </Link>
            </li>


            <li>
              <Link to="customers" className={location.pathname.includes("customers") ? "active" : ""}>
                <i className="fas fa-users"></i> Customers
              </Link>
            </li>

            <li>
              <Link to="clients" className={location.pathname.includes("authentication") ? "active" : ""}>
                <i className="fas fa-users"></i>
                Authentication & Settings
              </Link>
            </li>

            <li>
              <Link to="tools" className={location.pathname.includes("tools") ? "active" : ""}>
                <i className="fas fa-users"></i>
                Tools
              </Link>
            </li>

            <li>
              <Link to="reports" className={location.pathname.includes("reports") ? "active" : ""}>
                <i className="fas fa-users"></i>
                Reports
              </Link>
            </li>

            <li>
              <Link to="orderhistorypage" className={location.pathname.includes("orderhistorypage") ? "active" : ""}>
                <i className="fas fa-users"></i> OrderHistoryPage
              </Link>
            </li>

            {/* <li>
              <Link to="test" className={location.pathname.includes("test") ? "active" : ""}>
                <i className="fas fa-users"></i> 
                TestChangeStatus
              </Link>
            </li> */}

            <li>
              <button className="logout-button" onClick={() => {
                localStorage.removeItem("Token");
                navigate("authentication", { replace: true });
              }}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content-area">
        <Outlet />
      </div>
    </div>
  );
}