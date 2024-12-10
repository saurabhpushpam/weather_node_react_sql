import React from 'react'
import { useNavigate } from "react-router-dom";

const Errror = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='container'>
        <h4 style={{ color: "#d32f2f", marginBottom: "15px", fontSize: "22px", fontWeight: "900" }}>404 Error ! Page Not Found</h4>
        <button style={{ backgroundColor: "#c9ced2", width: "50%", height: "30px", fontSize: "16px", fontWeight: "700", color: "#d32f2f", border: "none", borderRadius: "10px", marginLeft: "22%" }} onClick={() => navigate("/")}>Home Page</button>
      </div>
    </>
  )
}

export default Errror