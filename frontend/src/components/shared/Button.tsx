import { Loader } from "../loader/Loader";

export const Button = ({ text, isLoggingIn }: { text: string, isLoggingIn: boolean }) => {
  return <button className=
  "flex items-center justify-center w-full h-12 text-white font-semibold rounded-lg hover:bg-[--primary] ">
    {isLoggingIn ? <Loader size={20} /> : text}
    </button>;
};