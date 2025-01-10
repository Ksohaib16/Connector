export const AuthHeader = ({
  heading,
  subHeading,
}: {
  heading: string;
  subHeading: string;
}) => {
  return (
    <div className="auth-header flex flex-col justify-center items-center content-center text-center mb-[2rem]">
      <div className="logo bg-[#ffff] h-24 w-24 lg:h-36 lg:w-36 rounded-full mb-[0.5rem] lg:mb-[0.1rem]"></div>
      <div className="auth-heading text-[2.5rem] lg:text-[4rem] text-[#ffff]   font-medium ">
        {heading}
      </div>
      <div className="auth-sub-heading text-[0.85rem] lg:text-[1rem] text-[#AAAAAA] w-64 ">
        {subHeading}
      </div>
    </div>
  );
};
