import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from 'react-router-dom'; 


export default function GetData() {
  const { tableId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getdata");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);




  
  return (
  //   <div>
  //     <h2>Fetched Categories</h2>
  //     {data ? (
  //       <div>
  //         {data.categories.map((category, index) => (
  //           <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
  //             <h3>{category.CategoryName}</h3>
  //             <ul>
  //               {/* {category.items.map((item) => (
  //                 <li key={item._id}>
  //                   <strong>{item.itemName}</strong> - ${item.price}  
  //                   <p>{item.description}</p>
  //                 </li>
  //               ))} */}
  //             </ul>
  //           </div>
  //         ))}
  //       </div>
  //     ) : (
  //       <p>Loading data...</p>
  //     )}
  //   </div>
  // );

 
    <div>
      <h2>Fetched Categories</h2>
      {data ? (
        <div
          className="Menu-content custom-scrollbar"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "90vw",
            margin: "auto",
            height: "auto",
            overflowY: "auto",
            padding: "1rem 0",
          }}
        >
          <div className="list-items">
            {data.categories.map((category, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <h3 >{category.CategoryName}</h3>
                {/* {category.items.map((item) => (
                  <button key={item._id}>
                    <Link
                      to={`/order/${tableId}/menu/${item.path}`}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "10px",
                        textAlign: "center",
                      }}
                      className="menu-link"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="menu-img"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "20%",
                          objectFit: "cover",
                          marginBottom: "8px",
                        }}
                      /> */}
                      {/* <span>{item.name}</span>
                    </Link>
                  </button>
                ))} */}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );

}
