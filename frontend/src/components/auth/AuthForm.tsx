import { Input } from "../shared/Input";
import { LucideIcon } from "lucide-react";
import { Button } from "../shared/Button";
// types/auth.ts
export interface FormError {
  [key: string]: string;
}

interface InputDetail {
  type: string;
  placeholder: string;
  name: string;
  icon: LucideIcon;
  errors: FormError;
}

export const AuthForm = ({
  errors,
  values,
  handleSubmit,
  handleChange,
  // handleFile,
  inputDetails,
  button,
  // avatarUrl,
  isLoggin,
}: {
  inputDetails: InputDetail[];
  button: boolean | string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  // handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values: {
    email: string;
    password: string;
  };
  errors: FormError;
  // avatarUrl: string;
  isLoggin: boolean;
}) => {
  return (
    <div className="auth-form w-[80%] md:w-[90%]  lg:w-[full] justify-center items-center">
      <form onSubmit={handleSubmit}>
        {/* <div className="avatar mb-4 opacity-80 flex items-center justify-between hover:bg-[var(--hover-secondary)] rounded-lg">
          <img
            className="w-16 h-16 rounded-full object-cover"
            src={avatarUrl || "./avatar.png"}
            alt=""
          />
          <label
            htmlFor="avatarUrl"
            className="text-[#AAAAAA] cursor-pointer underline"
          >
            Upload Profile
          </label>
          <input
            type="file"
            id="avatarUrl"
            name="avatarUrl"
            style={{ display: "none" }}
            onChange={handleFile}
          />
        </div> */}
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
        <Button isLoggin={isLoggin} text={button} />
      </form>
    </div>
  );
};
