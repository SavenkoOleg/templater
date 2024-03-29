import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
interface ModalProps {
  children: React.ReactNode;
  title: string;
  action: string;
  show: boolean;
  actionState: boolean;
  onClose: () => void;
  modalAction: () => void;
}

export function Modal({ children, title, action, show, actionState, onClose, modalAction }: ModalProps) {
  return (
    <>
      <div className={show ? "modal fade show" :"modal fade" } style={{display: "block"}}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">{children}</div>
            <div className="modal-footer">

              <button type="button" className={actionState ? "btn btn-primary" : "btn btn-danger"} onClick={modalAction}>
                {action}
              </button>
            </div>
          </div>

        </div>
      </div>
     
     {show && <div className={show ? "modal-backdrop fade show" :"modal-backdrop fade" }/>}
    </>
  );
}
