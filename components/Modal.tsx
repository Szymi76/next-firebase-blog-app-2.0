import React from "react";
import * as Button from "./Button";

interface ModalProps {
  label: React.ReactNode;
  show: boolean;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
  onConfirm: React.MouseEventHandler<HTMLButtonElement>;
}

const Modal = ({ label, show, onCancel, onConfirm }: ModalProps) => {
  return (
    <>
      {show ? (
        <div id="modal-wrapper">
          <div id="modal">
            {label}
            <div className="flex justify-between items-center gap-2">
              <Button.Solid onClick={onConfirm} children={"Dalej"} className="w-1/2" />
              <Button.Solid onClick={onCancel} children={"Cofnij"} className="w-1/2" />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Modal;
