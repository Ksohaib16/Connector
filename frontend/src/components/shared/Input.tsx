import { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

// Extend HTML input props
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;  
  name: string;
  icon?: LucideIcon;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error: string
}

export const Input = ({
  type = 'text',    // Default value
  placeholder,
  name,
  icon: Icon,
  onChange,
  value,
  error,
}: InputProps) => {
  return (
    <div className="relative mb-[1.5rem]">
      <input
      onChange={onChange}
      value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        className={`
          input 
          w-full
          h-[3.1rem] 
          bg-[#212121]
          text-[#FFFF]
          border-[0.5px] 
          rounded-[0.6rem] 
          px-[1.4rem] 
          ${error ? "border-[#E53935]" : "border-[#5b5b5ad9]"}
          placeholder:text-[0.75rem]
          ${Icon ? 'pr-[-.75rem]' : ''}
          hover:border-[var(--primary)]
          hover:border-[1px]
        `}
      />
      {Icon && (
        <Icon 
          className={`absolute right-4 ${error ? "top-1/3" : "top-1/2"} -translate-y-1/2 text-gray-400`} 
          size={20}
        />
      )}
      {error && <span className="error text-[#E53935] text-xs">{error}</span>}
    </div>
  );
};