import "bootstrap/dist/css/bootstrap.min.css";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import {IFile, IVar, TemplateContext} from "../context/TemplateContext"
import TableTemplate from "./TableTamplate";
import FileDownload from "./FileDownload";
import FileList from "./FileList";
import VarList from "./VarList"
import { useCookies } from 'react-cookie';
import FileUpload from "./FileUpload";
import NewVar from "./NewVar";
import { Modal } from "./Modal";
import { ModalContext } from "../context/ModalContext";
import Services from "../services/TemplaterService";

const General = () => {
  const {step, setFiles, setVars, varnn} = useContext(TemplateContext)

  const { modal, close, modalFlag, screenFlag, file, setScreenFlag, varn } = useContext(ModalContext);

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
        case "docs":
          setScreenFlag(1);
        break;
      case "vars":
          setScreenFlag(2);
        break;
      default:
        navigate("/");
    }
  }

  function createNewVar(){
    if (varnn.name.length > 0 && varnn.placeholder.length > 0) {
      if (varnn.id === 0) {
        Services.varCreate(cookies["token"], varnn)
            .then((response) => {
              updateVarList()
            })
            .catch((err) => {});
      } else {
        Services.varUpdate(cookies["token"], varnn)
            .then((response) => {
              updateVarList()
            })
            .catch((err) => {});
      }
    }
  }

  function updateFileList(){
    Services.getFiles(cookies["token"])
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

  function updateVarList(){
    Services.varGet(cookies["token"])
        .then((response) => {
          response.data.result.map((item:IVar) => {
            console.log(item)
            item.data = JSON.parse(String(item.data.replaceAll('\'', '\"')));
          })
          setVars(response.data.result);
        })
        .catch((err) => {
          // setMessage(err.response.data.error);
        });
  }

  function deleteVar(){
    if (varn !== undefined) {
      Services.varDelete(cookies["token"], varn?.id, )
          .then((response) => {
            // setVars(response.data.result);
          })
          .catch((err) => {
            // setMessage(err.response.data.error);
          });
    }
    updateVarList()
    close()
  }

  function deleteFile(){
    if (file !== undefined) {
      Services.deleteFile(file?.id, cookies["token"])
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

  return (
    <>
      <nav className="navbar navbar-dark bg-primary">
        <p className="navbar-brand">СМАРТ-ШАБЛОН</p>
        <div className="form-inline my-2 my-lg-0" style={{marginRight: "100px"}}>
          <button className="btn btn-outline-light my-2 my-sm-0" style={{marginRight: "10px"}} onClick={() => handleClick("docs")}>{"Документы"}</button>
          <button className="btn btn-outline-light my-2 my-sm-0" onClick={() => handleClick("vars")}>{"Переменные"}</button>
        </div>
        <div className="form-inline my-2 my-lg-0">
          <button className="btn btn-outline-light my-2 my-sm-0"
                  onClick={() => handleClick("log")}>{cookies["token"] ? "Выйти" : "Войти"}</button>
        </div>
      </nav>

      <div className="container App-Card">
        <div className="container" style={{padding: "0px", margin: "0px"}}>
          {screenFlag === 1 && (
              <div>
                <div className="my-3">
                  {step === 2 && <h4>Скачайте готовый файл</h4>}
                </div>

                <div className="my-3">
                  {step === 0 && <FileList/>}
                  {step === 1 && <TableTemplate/>}
                  {step === 2 && <FileDownload/>}
                </div>
              </div>
          )}

          {screenFlag === 2 && (
                <div className="my-3">
                  <VarList/>
                </div>
          )}

        </div>
      </div>

      {modal && screenFlag === 1 && (
          <Modal
              title={modalFlag === 1 ? "Загрузить новый шаблон" : "Удалить этот шаблон?"}
              action={modalFlag === 1  ? "Продолжить" : "Удалить"}
              actionState={modalFlag === 1}
              show={modal}
              modalAction={modalFlag === 1 ? () => {updateFileList();close()} : deleteFile}
          onClose={close}
        >
          {modalFlag === 1 ? <FileUpload /> : <div>{file?.filename}</div>}
        </Modal>
       )}

      {modal && screenFlag === 2 &&  (
          <Modal
              title={modalFlag === 1 ? "Создать новую шаблонную переменную?" : modalFlag === 2 ? "Удалить эту шаблонную переменную?" : "Редактирование переменной"}
              action={modalFlag === 1 || modalFlag === 3 ? "Продолжить" : "Удалить"}
              actionState={modalFlag === 1 || modalFlag === 3}
              show={modal}
              modalAction={modalFlag === 1 || modalFlag === 3 ? () => {createNewVar();close()} : deleteVar}
              onClose={close}
          >
            {modalFlag === 1 || modalFlag === 3 ? <NewVar /> : <div>{varn?.name} <span style={{color:"darkgrey"}}>{varn?.placeholder}</span></div>}
          </Modal>
      )}
    </>
  );
};

export default General;