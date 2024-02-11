import "bootstrap/dist/css/bootstrap.min.css";
import {useContext} from 'react'
import { TemplateContext } from "../context/TemplateContext";


const FileDownload = () => {
  const {outputFilename, setStep} = useContext(TemplateContext)
  const url = "http://194.87.147.163:1337/media/" + outputFilename;

  
  return (
    <>
      <div>
        <a className="btn btn-link" href={url} download>Скачать готовый файл</a>
      </div>
      <button
        className="btn btn-success btn-lg"
        onClick={setStep}
        >
        Начать заново
      </button>
    </>
  )
};

export default FileDownload;