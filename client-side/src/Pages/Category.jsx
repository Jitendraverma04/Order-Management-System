import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css-components/LeftComponent.css';
import '../Media-queries/MediaQueries.css';





export default function Category() {
  const { tableId } = useParams();


  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const validTables = ["T-1", "T-2", "T-3", "T-4", "T-5", "T-6", "T-7", "T-8"];

  useEffect(() => {
    if (!validTables.includes(tableId)) {
      navigate("/order/errorPage", { replace: true });
    }
  }, [tableId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userside/menudata`);
        if (response.data.success) {
          setCategories(response.data.categoryData);
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
  


  console.log(categories)

  return (
    <div className='Menu-content custom-scrollbar'
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        margin: 'auto',
        height: 'auto',
        overflowY: "auto",
        padding: '1rem 0',
      }}
    >
      <div className="list-items">
        {categories?.length > 0 ? (
          categories.map((category, index) => (
            <button key={index}>
               {category.categoryStatus ? (
              <Link to={`/order/${tableId}/menu/${category.categoryName}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0px",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
                className="menu-link"
              >
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}${category.categoryImage}`}
                  alt={category.categoryName}
                  className="menu-img"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "20%",
                    objectFit: "cover",
                    marginBottom: "8px",
                  }}
                />

<span>{formatCategoryName(category?.categoryName)}</span>
  </Link>
       ) : (
        /** ✅ If not active, show as disabled card */
        <div
          style={{
            opacity: 0.5,
            cursor: "not-allowed",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px",
            borderRadius: "10px",
            textAlign: "center",
          }}
          className="menu-link"
        >
          <img
            src={`${import.meta.env.VITE_SERVER_URL}${category.categoryImage}`}
            alt={category.categoryName}
            className="menu-img"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20%",
              objectFit: "cover",
              marginBottom: "8px",
            }}
          />
          <span>{formatCategoryName(category?.categoryName)}</span>
        </div>
      )}
    </button>
  ))
) : (
  <p>Loading categories...</p>
)}
</div>
</div>
);
}