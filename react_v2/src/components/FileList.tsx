import "bootstrap/dist/css/bootstrap.min.css";
import FileBlock from "./FileBlock";
import { useState, useContext, useEffect } from "react";
import {IFile, IVar, TemplateContext} from "../context/TemplateContext";
import FileUploadService from "../services/TemplaterService";
import { useCookies } from "react-cookie";
import { ModalContext } from "../context/ModalContext";
import { normalize } from "./utils";
import Services from "../services/TemplaterService";

const FileList = () => {
  const [currentFile, setCurrentFile] = useState<IFile>();

  const { open, setModalFlag, setFileModal } = useContext(ModalContext);

  const { setFilename, setStep, files, setFiles, setFile, setVars } = useContext(TemplateContext);

  const [message, setMessage] = useState<string>("");
  const [noactive, setNoActive] = useState<boolean>(false);

  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (!cookies["token"]) { 
      setNoActive(true)
    } else{
        FileUploadService.getFiles(cookies["token"])
        .then((response) => {
          response.data.result.map((item:IFile) => {
            item.props = JSON.parse(String(item.props.replaceAll('\'', '\"')));
          })
          setFiles(response.data.result);
        })
        .catch((err) => {
          if (err.response.data.noactive) {
            setNoActive(true)
          }
          setMessage(err.response.data.error);
        });
      }
  }, []);

  useEffect(() => {
    if (!cookies["token"]) {
      setNoActive(true)
    } else{
      Services.varGet(cookies["token"])
          .then((response) => {
            response.data.result.map((item:IVar) => {
              item.data = JSON.parse(String(item.data.replaceAll('\'', '\"')));
            })
            setVars(response.data.result);
          })
          .catch((err) => {
            if (err.response.data.noactive) {
              setNoActive(true)
            }
            setMessage(err.response.data.error);
          });
    }
  }, []);

  const selectFile = (id: number) => {
    var fileName = "";

    files.map((item) => {
      if (item.id === id) {
        item.props = normalize(item.props)
        setFile(item)
        fileName = item.filename;
      }
    });
  
    setFilename(fileName);
    setStep();
  };

  const deleteFile = (id: number) => {

    files.map((item) => {
      if (item.id === id) {
        setCurrentFile(item)
        setFileModal(item)
      }
    });

    setModalFlag(2);
    open()
  };

  return (
    <>
      <div className="row" style={{padding: "0px", margin: "0px"}}>

        <div className="col-9" style={{textAlign: "left", padding: "0px", margin: "0px"}}>
          <h5>Загруженные шаблоны</h5>
        </div>

        {!noactive &&
          <div className="col-3" style={{ textAlign: "right", padding: "0px", margin: "0px" }}>
            <button className="btn btn-success btn-sm" onClick={() => {
              setModalFlag(1);
              open();
            }}>
              Загрузить новый шаблон
            </button>
          </div>}

      </div>

      <div className="list-group" style={{ margin: "10px 0px 0px 0px", height: files.length ? "80vh" : "", overflowY: files.length < 10 ? "visible" : "scroll"}}>
        {files.length === 0 ?
        <div className={message ? "alert alert-warning" : cookies["token"] ? "alert alert-info" : "alert alert-danger"}>
          {message ? message : cookies["token"] ? "Шаблоны пока не загружены" : "Необходима авторизация"}
        </div>:
        files.map((item, index) => (
          <FileBlock
            item={item}
            index={index}
            selectFile={selectFile}
            deleteFile={deleteFile}
          />
        ))}
      </div>
    </>
  );
};

export default FileList;
