import "./modalOption.css";
import { LucideIcon } from "lucide-react";

interface Modal {
  icon: LucideIcon;
  option: string;
  switch?: LucideIcon; // Remove the ? operator
  className?: string;
  handleClick?: () => void;
}

export const ModalOption = ({
  icon: Icon,
  option,
  switch: SwitchIcon,
  className,
  handleClick,

}: Modal) => {
  return (
  <div className={`modal-option ${className}`} onClick={handleClick}>
      <div className="icon">
        <Icon />
      </div>
      <div className="option">{option}</div>
      {SwitchIcon && (
        <div className="switch">
          <SwitchIcon />
        </div>
      )}
    </div>
  );
};
