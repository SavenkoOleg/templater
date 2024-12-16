import React, {createContext, useState} from 'react'

export type IFile = {
  id: number;
  filename: string;
  props: any;
};

export type IVar = {
  id: number;
  name: string;
  placeholder: string;
  data: any;
};

export type IVarP = {
  id: number;
  name: string;
  placeholder: string;
  data: IDataVar[];
};

export type IDataVar = {
  id: number;
  text: string;
};

interface ITemplateContext {
  inputFilename: string
  outputFilename: string
  fileUpload: boolean
  paramsScan: string[]
  step: number
  files: IFile[]
  varnn: IVarP
  vars: IVar[]
  file: IFile
  setFilename: (filename:string) => void
  setOutputFilename: (filename:string) => void
  setStep: () => void
  setParams: (params:string[]) => void
  StepBack: () => void
  setFiles: (fls:IFile[]) => void
  setVars: (vrs:IVar[]) => void
  setFile: (fls:IFile) => void
  setVarBlock: (block:IVarP) => void
}

export const TemplateContext = createContext<ITemplateContext>({
  inputFilename: '',
  outputFilename: '',
  fileUpload: false,
  varnn: {
    id: 0,
    name: "",
    placeholder: "",
    data: []
  },
  paramsScan: [],
  step: 0,
  files: [],
  vars: [],
  file: {
    filename: "",
    id: 0,
    props: ""
  },
  setFilename: () => {},
  setOutputFilename: () => {},
  setParams: () => {},
  setStep: () => {},
  StepBack: () => {},
  setFiles: (fls:IFile[]) => {},
  setVars: (vrs:IVar[]) => {},
  setFile: (fls:IFile) => {},
  setVarBlock: (block:IVarP) => {},
})

export const TemplateState = ({ children }: {children: React.ReactNode}) => {
  const [inputFilename, setFileName] = useState('')
  const [outputFilename, setOutPutFilename] = useState('')
  const [fileUpload, setFileUpload] = useState(false)
  const [paramsScan, setScanParams] = useState<string[]>([]);
  const [step, setStepST] = useState<number>(0);
  const [files, setFilesCTX] = useState<IFile[]>([]);
  const [vars, setVarsCTX] = useState<IVar[]>([]);
  const [varnn, setVarBlockCTX] = useState<IVarP>({
    id: 0,
    name: "",
    placeholder: "",
    data: []
  });
  const [file, setFileCTX] = useState<IFile>({
    filename: "",
    id: 0,
    props: ""
  });

  const setFilename = (filename:string) => {
    setFileName(filename)
    setFileUpload(true)
  }

  const setOutputFilename = (filename:string) => {
    setOutPutFilename(filename)
  }

  const setParams = (params:string[]) => {
    setScanParams(params)
  }

  const setStep = () => {
    setStepST(prev => prev < 2 ? prev + 1 : 0)
    if (step === 2) {
      setFileName("")
    }
  }

  const StepBack = () => {
    setStepST(0)
    setFileName("")
  }

  const setFiles = (fls:IFile[]) => {
    setFilesCTX(fls)
  }

  const setVars = (vrs:IVar[]) => {
    setVarsCTX(vrs)
  }

  const setFile = (fl:IFile) => {
    setFileCTX(fl)
  }

  const setVarBlock = (block:IVarP) => {
    setVarBlockCTX(block)
  }


  return (
    <TemplateContext.Provider value={{ inputFilename, fileUpload, paramsScan,step,outputFilename, 
    setStep, setFilename, setParams, setOutputFilename, StepBack,
    files, setFiles, file, setFile, vars, setVars, varnn, setVarBlock}}>
      { children }
    </TemplateContext.Provider>
  )
}