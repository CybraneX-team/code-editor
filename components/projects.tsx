"use client"
import { setName } from "@/lib/slices/projectname";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomLink from "./customLink";

interface Project{
    name: string;
    ownerId: string
}

interface props {
    token: string
}

export default function Projects({token}: props){
    const [projects, setProjects] = useState([]);
    const dispatch = useDispatch();

    const handleClick = (name: string) => {
        dispatch(setName(name));
    }

    const getProjects = async () => {
        const res = await axios.get("http://localhost:5000/project", {headers: {
            Authorization: `Bearer ${token}`
        }});
        setProjects(res.data.projects);
    }

    useEffect(()=>{
        if(token){
            getProjects();
        }    
    },[token]);

    return(
        <div className="flex flex-col my-10 gap-5">
        {projects.map((project: Project)=>{
            return(
                <CustomLink name={project.name}>{project.name}</CustomLink>
            )
        })}
        </div>
    )
}