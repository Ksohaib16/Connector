import "./modalWrapper.css"
export const ModalWrapper = ({children}: {children: React.ReactNode }) => {
    return (
        <div className="modal-card">
            {children}
        </div>
    )
}