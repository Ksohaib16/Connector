import "./MainWrapper.css";

export const MainWrapper = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="main-wrapper h-screen w-screen">
            {children}
        </div>
    )
}