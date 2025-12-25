import { useRef, useEffect } from "react";

type Props = {
  id: string
  value: string
  type?: string
  isFocused: boolean
  children: React.ReactNode
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
};

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  children,
  isFocused,
  onInputChange,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    if(isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input 
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        autoFocus={isFocused} 
        onChange={onInputChange}/>
    </>
  )
};

export default InputWithLabel;