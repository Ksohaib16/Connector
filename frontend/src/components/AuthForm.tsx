import { Input } from "./shared/Input";
import { LucideIcon } from "lucide-react";
import { Button } from "./shared/Button";
export interface FormError {
  [key: string]: string;
}

interface InputDetail {
  type: string;
  placeholder: string;
  name: string;
  icon: LucideIcon;
  errors?: FormError;
}

export const AuthForm = ({
  errors,
  values,
  handleSubmit,
  handleChange,
  inputDetails,
  button,
  isLoggin,
}: {
  inputDetails: InputDetail[];
  button: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values: {
    name?: string;
    email: string;
    password: string
  };
  errors: FormError;
  isLoggin?: boolean
}) => {
  return (
    <div className="auth-form w-full">
      <form onSubmit={handleSubmit} >
        {inputDetails.map((input) => (
          <Input
            type={input.type}
            placeholder={input.placeholder}
            name={input.name}
            value={values[input.name as keyof typeof values]}
            error={errors[input.name]}
            icon={input.icon}
            onChange={handleChange}
          />
        ))}
        <Button isLoggingIn={isLoggin ?? false} text={button as string} />
      </form>
    </div>
  );
};
