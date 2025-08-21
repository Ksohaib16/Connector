import "./modalWrapper.css"

export const ModalWrapper = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="bg-slate-800/90 rounded-lg shadow-2xl p-2 max-w-max"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);
