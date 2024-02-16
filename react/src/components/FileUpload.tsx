import { useState, useContext } from "react";
import UploadService from "../services/FileUploadService";
import { TemplateContext } from "../context/TemplateContext";
import TemplaterService from "../services/TemplaterService";

const FileUpload: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<File>();
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const {inputFilename, setFilename, setParams, setStep} = useContext(TemplateContext)

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    setCurrentFile(selectedFiles?.[0]);
    setProgress(0);
  };

  const upload = () => {
    setProgress(0);
    if (!currentFile) return;

    UploadService.upload(currentFile, (event: any) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage(response.data.message);
        setFilename(response.data.result);
      })
      .catch((err) => {
        setProgress(0);

        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Could not upload the File!");
        }

        setCurrentFile(undefined);
      });
  };

  const scan = () => {
    TemplaterService.scan(inputFilename)
      .then((response) => {
        setParams(response.data.result)
        setStep()
      })
      .catch(() => {
      });
  }

  return (
    <div>
      <div className="row">
        <div className="col-8">
          <label className="btn btn-default p-0">
            <input type="file" onChange={selectFile} />
          </label>
        </div>

        <div className="col-4">
          <button
            className="btn btn-success btn-sm"
            disabled={!currentFile}
            onClick={upload}
          >
            Загрузить
          </button>
        </div>
      </div>

      {currentFile && (
        <div className="progress my-3">
          <div
            className="progress-bar progress-bar-info"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      {message && (
        <div className="alert alert-secondary mt-3" role="alert">
          {message}
        </div>
      )}

      <button
        className="btn btn-success btn-lg mr-30"
        onClick={scan}
        hidden={!inputFilename}
        >
        Дальше
      </button>
    </div>
  );
};

export default FileUpload;
