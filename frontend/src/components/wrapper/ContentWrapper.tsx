
import "./ContentWrapper.css"
export const ContentWrapper = ({children}: {children: React.ReactNode}) =>{
    return(
        <div className="content-wrapper flex justify-center items-center content-center">
            {children}
        </div>
    )
}