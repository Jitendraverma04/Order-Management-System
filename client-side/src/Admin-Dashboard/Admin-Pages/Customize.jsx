// src/components/Customize.jsx
import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
import '../Css-components/Customize.css';

export default function Customize() {
  const [categories, setCategories] = useState([]);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);

  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/categories/menudata`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      
        if (response.data) {
          setCategories(response.data.categoryData);
          console.log("response.data.categoryData",response.data.categoryData)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const formatCategoryName = (name) => {
    if (typeof name !== 'string') return "Unknown";
    const clean = name.replace(/(<([^>]+)>)/gi, "");
    return clean.length > 12 ? `${clean.slice(0, 10)}...` : clean;
  };

  const toggleMenu = (index, event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuOpenIndex(menuOpenIndex === index ? null : index);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/categories/delete/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
      setMenuOpenIndex(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/categories/updateCategoryStatus/${id}`, {
        status: !currentStatus
      });
      const updated = categories.map(cat =>
        cat._id === id ? { ...cat, categoryStatus: !currentStatus } : cat
      );
      setCategories(updated);
      setMenuOpenIndex(null);
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpenIndex !== null && !event.target.closest('.category-item')) {
        setMenuOpenIndex(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpenIndex]);

  return (
    <div className='Menu-content custom-scrollbar'>
      <div className="list-items">
        {categories?.length > 0 ? (
          categories.map((category, index) => (
            <div key={index} className="category-item">
              {category.categoryStatus ? (
                // *** IMPORTANT CHANGE HERE ***
                // Link to your new customizeItems route with the category name
                <Link
                  to={`/My-system/Admin/customizeItems/${category.categoryName}`}
                  className="menu-link"
                >
                  <div className="three-dot-menu" onClick={(e) => toggleMenu(index, e)}>⋮</div>
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}${category.categoryImage}`}
                    alt={category.categoryName}
                    className="menu-img"
                  />
                  <span>{formatCategoryName(category?.categoryName)}</span>
                  {category.items && (
                    <span className="item-count">
                      ({category.items.length} items)
                    </span>
                  )}
                </Link>
              ) : (
                <div className="menu-link disabled-category">
                  <div className="three-dot-menu" onClick={(e) => toggleMenu(index, e)}>⋮</div>
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}${category.categoryImage}`}
                    alt={category.categoryName}
                    className="menu-img"
                  />
                  <span>{formatCategoryName(category?.categoryName)}</span>
                  {category.items && (
                    <span className="item-count">
                      ({category.items.length} items)
                    </span>
                  )}
                </div>
              )}

              {menuOpenIndex === index && (
                <div className="dropdown-menu">
                  <button className="dropdown-button" onClick={() => handleDelete(category._id)}>Delete</button>
                  <button className="dropdown-button" onClick={() => handleToggleStatus(category._id, category.categoryStatus)}>
                    {category.categoryStatus ? "Disable" : "Enable"}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Loading categories...</p>
        )}
      </div>

      <Link to="/My-system/Admin/additem" className="floating-add-button">
        <span>+</span>
      </Link>
    </div>
  );
}