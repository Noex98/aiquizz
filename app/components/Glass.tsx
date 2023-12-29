import type { ReactNode } from "react"

export const Glass = ({children}: { children: ReactNode }) => {
    return (
        <div className="p-6 shadow-lg bg-gray-100 rounded-md backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100">
            {children}
        </div>
    )
}