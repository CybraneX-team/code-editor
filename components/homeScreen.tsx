"use client"
import { AppStore, makeStore } from "@/lib/store";
import { useEffect, useRef, useState } from "react"
import { Provider, useDispatch } from "react-redux";
import Projects from "./projects";


export default function HomeScreen(){
  
    const [token, setToken] = useState<string | null>(null);

    useEffect(()=>{
        const jwtToken = window.localStorage.getItem("jwt");
        if(!jwtToken){
            window.location.href = "/signin"
        }
        setToken(jwtToken);
    });

   
    return(
     
        <div className="">
            <h1 className=" text-2xl">Your projects</h1>
           <Projects token={token!}/>
        </div>
 

    )
}