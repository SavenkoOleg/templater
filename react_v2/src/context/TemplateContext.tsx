import React, {createContext, useState} from 'react'

export type IFile = {
  id: number;
  filename: string;
  props: any;
};

interface ITemplateContext {
  inputFilename: string
  outputFilename: string
  fileUpload: boolean
  paramsScan: string[]
  step: number
  files: IFile[]
  file: IFile
  setFilename: (filename:string) => void
  setOutputFilename: (filename:string) => void
  setStep: () => void
  setParams: (params:string[]) => void
  StepBack: () => void
  setFiles: (fls:IFile[]) => void
  setFile: (fls:IFile) => void
}

export const TemplateContext = createContext<ITemplateContext>({
  inputFilename: '',
  outputFilename: '',
  fileUpload: false,
  paramsScan: [],
  step: 0,
  files: [],
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
  setFile: (fls:IFile) => {},
})

export const TemplateState = ({ children }: {children: React.ReactNode}) => {
  const [inputFilename, setFileName] = useState('')
  const [outputFilename, setOutPutFilename] = useState('')
  const [fileUpload, setFileUpload] = useState(false)
  const [paramsScan, setScanParams] = useState<string[]>([]);
  const [step, setStepST] = useState<number>(0);
  const [files, setFilesCTX] = useState<IFile[]>([]);
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

  const setFile = (fl:IFile) => {
    setFileCTX(fl)
  }


  return (
    <TemplateContext.Provider value={{ inputFilename, fileUpload, paramsScan,step,outputFilename, 
    setStep, setFilename, setParams, setOutputFilename, StepBack,
    files, setFiles, file, setFile }}>
      { children }
    </TemplateContext.Provider>
  )
}