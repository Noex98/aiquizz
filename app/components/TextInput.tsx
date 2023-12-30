interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "type"> {
    
}

export const TextInput = ({children, ...rest}: Props) => {
    return (
        <input type="text" className="text-black w-full" {...rest}/>
    )
}