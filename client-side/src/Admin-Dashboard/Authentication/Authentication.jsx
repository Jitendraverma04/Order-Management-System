import React, { useState } from 'react'
// import { Link, Navigate } from 'react-router-dom';
import "../Css-components/Authentication.css"

import Register from './Register';
import Login from './Login';

export default function Authentication() {


  // const [activeComponent, setActiveComponent] = useState("register");
  // const [isRegisterVisible, setIsRegisterVisible] = useState(true);
  // const [isLoginVisible, setIsLoginVisible] = useState(false);


  // const handleComponentSwitch = (component) => {
  //   setActiveComponent(component);
  //   if (component === "register") {
  //     setIsRegisterVisible(true);
  //     setIsLoginVisible(false);
  //   } else if (component === "login") {
  //     setIsRegisterVisible(false);
  //     setIsLoginVisible(true);
  //   }
  // };

  return (
    <div>
      <div className="HomeComponent">

        <div className="LeftSide">
         <h2>Welcome to CafeManager Pro!</h2> 
         <h5>Your all-in-one solution for running a smarter, more efficient cafe.

          As the admin, you’re in control of everything that keeps your cafe running smoothly from managing daily operations to making informed business decisions.

          <br/>With CafeManager Pro, you can:<br/><br/>

          Easily add or update menu items<br/>
          Track orders and table status in real time<br/>
          Monitor staff activity and shift schedules<br/>
          View detailed analytics to understand what’s working and what’s not<br/>
          Our goal is to take the stress out of operations so you can focus on what really matters creating great experiences for your customers.<br/>

          Let’s make managing your cafe simpler, faster, and smarter together.</h5>

        </div>


        <div className="RightSide">

          {/* <div className="navigate">
            <a onClick={() => handleComponentSwitch("login")} style={{ display:"block", color: "blue", cursor: "pointer" }}>Login </a>
          </div> */}

          <div>
            {/* {activeComponent === "register" && <Register />} */}
            <Login />
          </div>
        </div>

      </div>

    </div>
  )
}


