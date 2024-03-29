import { useState, useContext } from "react";
import UploadService from "../services/FileUploadService";
import { TemplateContext } from "../context/TemplateContext";
import TemplaterService from "../services/TemplaterService";
import { useCookies } from 'react-cookie';

const FileUpload: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<File>();
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(true);

  const {setFilename} = useContext(TemplateContext)

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    setCurrentFile(selectedFiles?.[0]);
    setProgress(0);
  };

  const [cookies] = useCookies(['token']);

  const upload = () => {
    setProgress(0);
    if (!currentFile) return;

    UploadService.upload(currentFile, cookies["token"], (event: any) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        if (!response.data.success) {
          setMessage(response.data.error);
          setSuccess(false)
        } else {
          setSuccess(true)
          setMessage("Файл готов к работе!");
          setFilename(response.data.result);
        }
      })
      .catch((err) => {
        setProgress(0);
        setSuccess(false)
        if (err.response && err.response.data && err.response.data.error) {
          setMessage(err.response.data.error);
        } else {
          setMessage("Упс... произошла какая-то ошибка...");
        }

        setCurrentFile(undefined);
      });
  };

  return (
    <div>
      <div className="row">
        <div className="col-8">
          <label className="btn btn-default p-0">
            <input type="file" accept=".doc,.docx" onChange={selectFile} />
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
        <div className={success ? "alert alert-success mt-3" : "alert alert-warning mt-3"}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
