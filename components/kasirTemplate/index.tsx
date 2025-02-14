"use client"
import { ReactNode } from "react"
import Sidebar from "./sidebar"
import { title } from "process";

type MenuType = {
    id: string;
    icon: ReactNode,
    path: string,
    label: string
}

type KasirProp = {
    children: ReactNode,
    id: string,
    title: string,
    menuList: MenuType[]
}

const ManagerTemplate = ({ children, id, title, menuList }: KasirProp) => 
    { 
    return ( 
    <div className="w-full min-h-dvh bg-slate-50"> 
    <Sidebar menuList={menuList} title={title} id={id}> 
    {children} 
    </Sidebar> 
    </div> 
    ) 
    } 

export default ManagerTemplate