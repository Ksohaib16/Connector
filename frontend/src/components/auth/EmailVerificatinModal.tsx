import "./EmailVerificationModal.css"

export const EmailVerificationModal = ({email, onClose}: {email: string, onClose?: () => void}) => {
    return (
      <div className="email-verification-modal" onClick={onClose}>
        <div className="email-modal-background absolute"></div>
        <div className="email-modal-card " onClick={(e) => e.stopPropagation()}>
            <img src="/no-email.png" alt=""  />
          <h1>Please verify your email</h1>
          <p>We just sent an email to <b>{email}</b> <br />Click the link i the email to verify your account. </p>
        </div>
      </div>
    );
  };
