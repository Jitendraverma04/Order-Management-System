import React from 'react';
import {useParams} from 'react-router-dom';

export default function Header() {

  
  const { tableId } = useParams();

  return (
    <div>
      <div
        className="header-section"
        style={{
          position:"fixed",
          display: "flex",
          background: "#FFFFFF",
          justifyContent: "center",
          textAlign: "center",
          width:"100%",
          borderBottom: "2px solid black"
        }}
      >
        <header>
          <h2 style={{ margin: "0",color:'black' }}>Hello From Cafe Name</h2><br/>
          <h2 style={{ margin: "0",color:'black' }}>🍽️ {tableId}</h2>
        </header>
      </div>
    </div>
  );
}
