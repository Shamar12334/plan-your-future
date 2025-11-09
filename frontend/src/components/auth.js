import React,{useState} from "react";
import { register, login} from "../api";
export default function Auth({onLogin}){
    const [isRegister,setIsRegister] = useState(false);
    const[username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function  handleSubmit(e) {
        e.preventDefault();
        const action = isRegister ? register : login;
        const res = await action(username,password);
        if (res.error) setMessage(res.error);
        else{
            setMessage(res.message);
            if (!isRegister) onLogin(username);
        }
    }
    return(
    <div>
        <h1>{isRegister ? "Register":"login"}</h1>
        <form onSubmit={handleSubmit}>
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">{isRegister ? "Register": "Login"}</button>
        </form>
        <p>{message}</p>
        <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "do  you have an account? Login":"Register"}
        </button>
    </div>
  );
}
