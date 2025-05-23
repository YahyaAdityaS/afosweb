"use client"


import { ReactNode } from "react"

type Props = {
    children: ReactNode
    type: "button" | "submit" | "reset",
    onClick?: () => void
    className?: string
}

export const ButtonSuccess = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}

export const ButtonWarning = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-yellow-500 text-white rounded-md py-2 px-4 hover:bg-yellow-600 font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}

export const ButtonDanger = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-red-600 text-white rounded-md py-2 px-4 hover:bg-red-700 font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}

export const ButtonSuccesOutline = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-white border-2 border-green-500 text-green-500 rounded-md py-2 px-4 hover:bg-green-500 hover:text-white font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}

export const ButtonDangerOutline = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-white border-2 border-red-500 text-red-500 rounded-md py-2 px-4 hover:bg-red-500 hover:text-white font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}

export const ButtonInfoOutline = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-white border-2 border-cyan-500 text-cyan-500 rounded-md py-2 px-4 hover:bg-cyan-500 hover:text-white font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}