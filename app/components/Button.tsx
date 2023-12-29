interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children: React.ReactNode
}

export const Button = ({children, ...rest}: Props) => {
    return (
        <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300 font-bold"
            {...rest}
        >
            {children}
        </button>
    )
}