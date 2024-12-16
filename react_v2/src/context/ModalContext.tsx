import React, {createContext, useState} from 'react'
import {IFile, IVar} from "../context/TemplateContext";

interface IModalContext {
  modal: boolean
  modalFlag: number
  screenFlag: number
  file: IFile|undefined
  varn: IVar|undefined
  open: () => void
  close: () => void
  setModalFlag: (i:number) => void
  setScreenFlag: (i:number) => void
  setFileModal: (i:IFile|undefined) => void
  setVarModal: (i:IVar|undefined) => void
}

export const ModalContext = createContext<IModalContext>({
  modal: false,
  modalFlag: 1,
  screenFlag: 1,
  file: undefined,
  varn: undefined,
  open: () => {},
  close: () => {},
  setModalFlag: (i:number) => {},
  setScreenFlag: (i:number) => {},
  setFileModal: (i:IFile|undefined) => {},
  setVarModal: (i:IVar|undefined) => {},
})

export const ModalState = ({ children }: {children: React.ReactNode}) => {
  const [modal, setModal] = useState(false)
  const [file, setFilenameI] = useState<IFile>();
  const [varn, setVarnameI] = useState<IVar>();
  const [modalFlag, setModalFlagI] = useState<number>(1);
  const [screenFlag, setScreenFlagI] = useState<number>(1);

  const open = () => setModal(true)

  const close = () => setModal(false)

  const setModalFlag = (i:number) => setModalFlagI(i)

  const setFileModal = (i:IFile|undefined) => setFilenameI(i)

  const setVarModal = (i:IVar|undefined) => setVarnameI(i)

  const setScreenFlag = (i:number) => setScreenFlagI(i)


  return (
    <ModalContext.Provider value={{ modal, open, close, modalFlag, screenFlag, setModalFlag, file, setScreenFlag, setFileModal, varn, setVarModal}}>
      { children }
    </ModalContext.Provider>
  )
}