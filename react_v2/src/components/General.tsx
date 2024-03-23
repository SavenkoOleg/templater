import "bootstrap/dist/css/bootstrap.min.css";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import {IFile, TemplateContext} from "../context/TemplateContext"
import TableTemplate from "./TableTamplate";
import FileDownload from "./FileDownload";
import FileList from "./FileList";
import { useCookies } from 'react-cookie';
import FileUpload from "./FileUpload";
import { Modal } from "./Modal";
import { ModalContext } from "../context/ModalContext";
import FileUploadService from "../services/TemplaterService";

const General = () => {
  const {step, setFiles} = useContext(TemplateContext)

  const { modal, close, modalFlag, file } = useContext(ModalContext);

  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  function handleClick(path: string) {
    switch (path) {
      case "log":
        navigate("/login");
        removeCookie('token');
        break;
      case "rec":
        navigate("/recovery");
        break;
      default:
        navigate("/");
    }
  }

  function updateFileList(){
    FileUploadService.getFiles(cookies["token"])
    .then((response) => {
      response.data.result.map((item:IFile) => {
        item.props = JSON.parse(String(item.props.replaceAll('\'', '\"')));
      })
      setFiles(response.data.result);
    })
    .catch((err) => {
      // setMessage(err.response.data.error);
    });
  }

  function deleteFile(){
    if (file !== undefined) {
      FileUploadService.deleteFile(file?.id, cookies["token"])
      .then((response) => {
        setFiles(response.data.result);
      })
      .catch((err) => {
        // setMessage(err.response.data.error);
      });
    }
    updateFileList()
    close()
  }
  // var step = 1
  return (
    <>
      <nav className="navbar navbar-dark bg-primary">
        <p className="navbar-brand">Шаблонизатор</p>
        <div className="form-inline my-2 my-lg-0">
          <button className="btn btn-outline-light my-2 my-sm-0" onClick={() => handleClick("log")}>{cookies["token"] ? "Выйти" : "Войти"}</button>
        </div>
      </nav>

      <div className="container App-Card">
        <div className="container" style={{padding: "0px", margin: "0px"}}>

          <div className="my-3">
            {step === 2 && <h4>Скачайте готовый файл</h4>}
          </div>

          <div className="my-3">
            {step === 0 && <FileList/>}
            {step === 1 && <TableTemplate/>}
            {step === 2 && <FileDownload/>}
          </div>

        </div>
      </div>

      {modal && (
        <Modal
          title={modalFlag === 1 ? "Загрузить новый шаблон" : "Удалить этот шаблон?"}
          action={modalFlag === 1 ? "Сохранить" : "Удалить"}
          show={modal}
          modalAction={modalFlag === 1 ? () => {updateFileList();close()} : deleteFile}
          onClose={close}
        >
          {modalFlag === 1 ? <FileUpload /> : <div>{file?.filename}</div>}
        </Modal>
       )}
    </>
  );
};

export default General;