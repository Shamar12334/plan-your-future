import {  useState } from "react";
import Auth from "./components/auth";
import RoadmapPage from "./components/roadmapPage";
import Dashboard from "./components/dashboard";
function App() {
  const[user,setUser] = useState(null)
  return (
    <div>
      <h1>Plan Your Future</h1>
      {user ? (
        <Dashboard username={user}/>
      ) : (
        <Auth onLogin={(username) => setUser(username)} />
      )}
    </div>
  );
}

export default App;
