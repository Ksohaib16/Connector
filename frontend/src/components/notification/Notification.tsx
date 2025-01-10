import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './notification.css';

export const Notification = () => {
    return(
        <div className="">
            <ToastContainer 
                position="top-right" 
                autoClose={3000}
                toastClassName="custom-toast-container"
                progressClassName="custom-progress-bar"
            />
        </div>
    )
}
