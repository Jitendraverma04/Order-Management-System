// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import AdminLayoutPage from "../Admin-Pages/AdminLayoutPage";

// const ProtectedRoute = () => {
//   const [isValidToken, setIsValidToken] = useState(null);

//   useEffect(() => {
//     const validateToken = async () => {
//       const token = localStorage.getItem("Token");
//       console.log("Token found:", token);

//       if (!token) {
//         setIsValidToken(false);
//         return;
//       }

//       try {
//         const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/validateToken`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();

//         if (data.token) {
//           localStorage.setItem("Token", data.token);
//           setIsValidToken(true);
//         } else {
//           setIsValidToken(false);
//         }
//       } catch (err) {
//         console.error("Token validation error:", err);
//         setIsValidToken(false);
//       }
//     };

//     validateToken();
//   }, []);

//   if (isValidToken === null) {
//     return <div>Loading...</div>;
//   }

//   return isValidToken ? (
//     <AdminLayoutPage />
//   ) : (
//     <Navigate to="/my-system/admin/authentication" />
//   );
// };

// export default ProtectedRoute;



import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import AdminLayoutPage from "../Admin-Pages/AdminLayoutPage";

const ProtectedRoute = () => {
  const token = localStorage.getItem("Token");
  console.log("Token found:", token);
  return token ? <AdminLayoutPage /> : <Navigate to="/my-system/admin/authentication" />;
};

export default ProtectedRoute;