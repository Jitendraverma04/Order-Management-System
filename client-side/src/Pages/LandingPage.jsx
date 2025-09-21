import React from 'react'
import HotCoffeeImg from "../assets/images/Hot-coffee-img.jpg";
import NoodlesImg from "../assets/images/noodles-img.jpg";
import PastaImg from "../assets/images/pasta-img.jpg";
import PizzaImg from "../assets/images/pizza-img.jpg";
import SandwhichImg from "../assets/images/sandwich-img.jpg";
import "../css-components/LandingPage.css"

import {Outlet} from 'react-router-dom'






export default function LandingPage() {
 
  return (
    <div>

<Outlet/>
    

      <section>
        <div className="cafe-items">
          <div className="items-img"> <div className="item"><img src={HotCoffeeImg} alt="" />Coffee</div></div>
          <div className="items-img"> <div className="item"><img src={NoodlesImg} alt="" />Noodles</div></div>
          <div className="items-img"> <div className="item"><img src={PastaImg} alt="" />Pasta</div></div>
          <div className="items-img"> <div className="item"><img src={PizzaImg} alt="" />Pizza</div></div>
          <div className="items-img"> <div className="item"><img src={SandwhichImg} alt="" />Sandwhich</div></div>
        </div>
      </section>


    </div>
  )
}
