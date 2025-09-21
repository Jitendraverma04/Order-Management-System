import React,{useEffect} from 'react'
import { Link,useParams,useNavigate } from 'react-router-dom';

export default function HelloPage() {

  const{tableId}=useParams();
  const navigate = useNavigate();

  const validTables = ["T-1", "T-2", "T-3", "T-4", "T-5", "T-6", "T-7", "T-8"];

  useEffect(() => {
    if (!validTables.includes(tableId)) {
      navigate("/order/errorPage", { replace: true });
    }
  }, [tableId, navigate]);

  return (
    <div>
      <div style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column", 
        alignItems: "center",    
        justifyContent: "center",
        minHeight: "100vh", 
        minWidth:"100vw"  
      }}>

        <div style={{background:"#007BFF",padding:"3rem"}}>
        <h1>Hello sir/mam</h1>
        <h2>Order-Now</h2>
        <Link to={`/order/${tableId}/menu`}style={{ textDecoration: "none",color:"black"}}><button>Menu</button></Link>
      </div>
      </div>
    </div>
  )
}