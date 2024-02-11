import React, {createContext, useState} from 'react'

interface ITemplateContext {
  inputFilename: string
  outputFilename: string
  fileUpload: boolean
  paramsScan: string[]
  step: number
  setFilename: (filename:string) => void
  setOutputFilename: (filename:string) => void
  setStep: () => void
  setParams: (params:string[]) => void
}

export const TemplateContext = createContext<ITemplateContext>({
  inputFilename: '',
  outputFilename: '',
  fileUpload: false,
  paramsScan: [],
  step: 0,
  setFilename: () => {},
  setOutputFilename: () => {},
  setParams: () => {},
  setStep: () => {},
})

export const TemplateState = ({ children }: {children: React.ReactNode}) => {
  const [inputFilename, setFileName] = useState('')
  const [outputFilename, setOutPutFilename] = useState('')
  const [fileUpload, setFileUpload] = useState(false)
  const [paramsScan, setScanParams] = useState<string[]>([]);
  const [step, setStepST] = useState<number>(0);

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
  }

  return (
    <TemplateContext.Provider value={{ inputFilename, fileUpload, paramsScan,step,outputFilename,  setStep, setFilename, setParams, setOutputFilename }}>
      { children }
    </TemplateContext.Provider>
  )
}