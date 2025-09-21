// src/components/CustomizeItems.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../Css-components/Customize.css'; // Reusing your existing CSS for consistency

export default function CustomizeItems() {
  const { categoryName } = useParams(); // Get the categoryName from the URL
  const [categoryId, setCategoryId] = useState(null); // State to store the category's _id
  const [items, setItems] = useState([]); // State to store the items for the found category
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);


  const token = localStorage.getItem("Token")
  useEffect(() => {
    const fetchCategoryAndItems = async () => {
      try {
        // Fetch ALL categories with their embedded items
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/categories/menudata`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

        console.log("API response for menudata:", response);

        if (response.data.success && Array.isArray(response.data.categoryData)) {
          // Find the specific category object from the array based on the categoryName from URL params
          const foundCategory = response.data.categoryData.find(
            (cat) => cat.categoryName === categoryName
          );

          if (foundCategory) {
            // If the category is found, set its _id and its items array to state
            setCategoryId(foundCategory._id);
            setItems(foundCategory.items);
          } else {
            // If categoryName from URL doesn't match any category in the data
            console.warn(`Category "${categoryName}" not found in fetched data.`);
            setCategoryId(null);
            setItems([]); // Clear items if category not found
          }
        } else {
          // Handle cases where API call was successful but data format is unexpected
          console.error("Failed to fetch category data or invalid format:", response.data);
          setCategoryId(null);
          setItems([]); // Clear items on error
        }
      } catch (error) {
        // Handle network errors or other issues with the API call
        console.error("Error fetching categories and items:", error);
        setCategoryId(null);
        setItems([]); // Clear items on error
      }
    };

    fetchCategoryAndItems();
  }, [categoryName]);


  
  // console.log("items",items);

  // Helper function to format item names (same as your category formatter)
  const formatItemName = (name) => {
    if (typeof name !== 'string') return "Unknown";
    const clean = name.replace(/(<([^>]+)>)/gi, "");
    return clean.length > 25 ? `${clean.slice(0, 10)}...` : clean;
  };

  // Toggle the 3-dot menu for an item
  const toggleMenu = (index, event) => {
    event.preventDefault(); // Prevent default link behavior
    event.stopPropagation(); // Stop event propagation
    setMenuOpenIndex(menuOpenIndex === index ? null : index);
  };



  const handleDeleteItem = async (itemId) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    // if (!category || !category._id) {
    //     console.error("Category ID is missing for item deletion.");
    //     alert("Error: Category information not available.");
    //     return;
    // }

    try {
      // Send both category ID and item ID
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/categories/delete/${categoryId}/${itemId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

      setItems(items.filter(item => item._id !== itemId));
      setMenuOpenIndex(null);
    } catch (err) {
      console.error("Item delete failed", err);
      alert("Failed to delete item.");
    }
  };

 

  // Handle toggling item status (Enable/Disable)
  const handleToggleItemStatus = async (itemId, currentStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/categories/updateItemStatus/${categoryName}/${itemId}`,
        {
          status: !currentStatus, // data object
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the status in the local state
      const updated = items.map(item =>
        item._id === itemId ? { ...item, itemStatus: !currentStatus } : item
      );
      setItems(updated);
      setMenuOpenIndex(null); // Close the menu
    } catch (err) {
      console.error("Item status update failed", err);
      alert("Failed to update item status.");
    }
  };

  // Effect to close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if a menu is open AND the click was outside of any category-item
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
      <h2>Items in {decodeURIComponent(categoryName)}</h2> {/* Display the category name */}
      <div className="list-items">
        {items?.length > 0 ? (
          items.map((item, index) => (
            <div key={item._id} className="category-item"> {/* Using item._id as key is better */}
              {item.itemStatus ? (
                // Active item link - you might navigate to an item detail page or just display
                <Link
                  className="menu-link"
                >
                  <div className="three-dot-menu" onClick={(e) => toggleMenu(index, e)}>⋮</div>
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}/${item.itemImage}`}
                    alt={item.itemName}
                    className="menu-img"
                  />
                  <span>{formatItemName(item?.itemName)}</span>
                </Link>
              ) : (
                // Disabled item display (not clickable for ordering, but 3-dot menu is active)
                <div className="menu-link disabled-category">
                  <div className="three-dot-menu" onClick={(e) => toggleMenu(index, e)}>⋮</div>
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}/${item.itemImage}`}
                    alt={item.itemName}
                    className="menu-img"
                  />
                  <span>{formatItemName(item?.itemName)}</span>
                </div>
              )}

              {menuOpenIndex === index && (
                <div className="dropdown-menu">
                  <button className="dropdown-button" onClick={() => handleDeleteItem(item._id)}>Delete</button>
                  <button className="dropdown-button" onClick={() => handleToggleItemStatus(item._id, item.itemStatus)}>
                    {item.itemStatus ? "Disable" : "Enable"}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No items found in this category.</p>
        )}
      </div>

      {/* Optional: Add button to add a new item specifically to THIS category */}
      {/* You could pass the categoryName as a query parameter or state */}
      <Link to="/My-system/Admin/additem" className="floating-add-button">
        <span>+</span>
      </Link>
    </div>
  );
}