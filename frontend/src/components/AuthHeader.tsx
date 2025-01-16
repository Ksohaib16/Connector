export const AuthHeader = ({
  heading,
  subHeading,
}: {
  heading: string;
  subHeading: string;
}) => {
  return (
    <div className="auth-header flex flex-col justify-center items-center content-center text-center mb-[2.5rem]">
      <div className="logo bg-[#ffff] h-32 w-32 rounded-full"></div>
      <div className="auth-heading text-[3rem] text-[#ffff] mb-[0.25rem] font-semibold">{heading}</div>
      <div className="auth-sub-heading text-[1rem] text-[#AAAAAA] w-64">{subHeading}</div>
    </div>
  );
};
