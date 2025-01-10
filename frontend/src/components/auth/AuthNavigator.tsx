import { Link } from "react-router-dom"

interface Navigator {
    label: string,
    buttonText: string,
    to: string
}

export const AuthNavigator = ({label, buttonText, to}: Navigator) =>{
    return (
        <div className="auth-navigator flex gap-3">
            <div className="btn-label text-[#AAAAAA]">
                {label}
            </div>
            <Link className="btn-text text-[#3874c9] font-bold hover:underline" to={to}>
                {buttonText}
            </Link>
        </div>
    )
}