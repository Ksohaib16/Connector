export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div
        className="relative auth-wrapper w-[21rem] flex flex-col 
        content-center items-center"
      >
        {children}
      </div>
    );
  };
  