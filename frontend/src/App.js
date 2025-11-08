import { useEffect, useState } from "react";
function App() {
  const[Welcome,setMessage] =useState("loading...")
  useEffect(() =>{
    fetch("http://127.0.0.1:5000/") //Backend url
    .then((response)=> response.json())
    .then((data)=> setMessage(data.Welcome))
    .catch((error) =>{
      console.error("Error fetching from the backend:",error);
      setMessage("Connection failed");
    });
  },[]);
  return (
    <div style={{textAlign: "center",marginTop: "3rem"}}>
      <h1>Plan Your Future</h1>
      <p>{Welcome}</p>
    </div>
  );
}

export default App;
