import "./EmailVerificationModal.css"
import { Portal } from "../shared/Portal";

export const EmailVerificationModal = ({email, onClose}: {email: string, onClose?: () => void}) => {
    return (
      <Portal>
        <div className="email-verification-modal fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
          <div className="email-modal-background absolute"></div>
          <div className="email-modal-card " onClick={(e) => e.stopPropagation()}>
              <img src="/no-email.png" alt="Email verification required"  />
            <h1>Please verify your email</h1>
            <p>We just sent an email to <b>{email}</b> <br />Click the link in the email to verify your account.</p>
          </div>
        </div>
      </Portal>
    );
  };
