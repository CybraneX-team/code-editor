"use client"
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

//todo: Error handling

export default function Signin(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async() => {
        let res = await axios.post("http://localhost:5000/signin", {email: email, password: password});
        console.log(res);
        if(res.status === 200){
            localStorage.setItem("jwt", res.data.token);
            window.location.href = "/";
        }
    }

    const inputStyle = "bg-black border-2 border-gray-700 p-3 rounded-md";
    return(
        <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-24">
                <input placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} className={inputStyle}/>
                <input placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} className={inputStyle}/>
                <Button onClick={handleSubmit}>Sign in</Button>
        </div>
    )
}