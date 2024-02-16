import "bootstrap/dist/css/bootstrap.min.css";
import {useContext} from 'react'
import { TemplateContext } from "../context/TemplateContext";


const FileDownload = () => {
  const {outputFilename, setStep} = useContext(TemplateContext)
  const url = process.env.REACT_APP_PPOTOCOL + "://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORT + "/" + process.env.REACT_APP_STATIC + "/" + outputFilename;

  
  return (
    <>
      <div>
        <a className="btn btn-link" href={url} download>Скачать готовый файл</a>
      </div>
      <button
        className="btn btn-success btn-lg mr-30"
        onClick={setStep}
        >
        Начать заново
      </button>
    </>
  )
};

export default FileDownload;