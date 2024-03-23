import React, {createContext, useState} from 'react'
import {IFile } from "../context/TemplateContext";

interface IModalContext {
  modal: boolean
  modalFlag: number
  file: IFile|undefined
  open: () => void
  close: () => void
  setModalFlag: (i:number) => void
  setFileModal: (i:IFile|undefined) => void
}

export const ModalContext = createContext<IModalContext>({
  modal: false,
  modalFlag: 1,
  file: undefined,
  open: () => {},
  close: () => {},
  setModalFlag: (i:number) => {},
  setFileModal: (i:IFile|undefined) => {},
})

export const ModalState = ({ children }: {children: React.ReactNode}) => {
  const [modal, setModal] = useState(false)
  const [file, setFilenameI] = useState<IFile>();
  const [modalFlag, setModalFlagI] = useState<number>(1);

  const open = () => setModal(true)

  const close = () => setModal(false)

  const setModalFlag = (i:number) => setModalFlagI(i)

  const setFileModal = (i:IFile|undefined) => setFilenameI(i)

  return (
    <ModalContext.Provider value={{ modal, open, close, modalFlag, setModalFlag, file, setFileModal}}>
      { children }
    </ModalContext.Provider>
  )
}