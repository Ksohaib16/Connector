export const AuthHeader = ({
  heading,
  subHeading,
}: {
  heading: string;
  subHeading: string;
}) => {
  return (
    <div className="auth-header flex flex-col justify-center items-center content-center text-center mb-[2.5rem]">
      <div className="logo bg-[#ffff] h-24 w-24 rounded-full mb-[1.4rem]"></div>
      <div className="auth-heading text-[2.25rem] text-[#ffff] mb-[0.5rem] font-medium">{heading}</div>
      <div className="auth-sub-heading text-[1rem] text-[#AAAAAA] w-64">{subHeading}</div>
    </div>
  );
};
