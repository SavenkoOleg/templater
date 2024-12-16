import "bootstrap/dist/css/bootstrap.min.css";
import VarBlock from "./VarBlock";
import { useState, useContext, useEffect } from "react";
import {IFile, IVar, TemplateContext} from "../context/TemplateContext";
import Services from "../services/TemplaterService";
import { useCookies } from "react-cookie";
import { ModalContext } from "../context/ModalContext";
import { normalize } from "./utils";
import FileUploadService from "../services/TemplaterService";

const VarList = () => {
  const [currentVar, setCurrentVar] = useState<IVar>();

  const { open, setModalFlag, setVarModal } = useContext(ModalContext);

  const { setFilename, setStep, files, setFile, vars, setVarBlock} = useContext(TemplateContext);


  const [message, setMessage] = useState<string>("");
  const [noactive, setNoActive] = useState<boolean>(false);

  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (!cookies["token"]) {
      setNoActive(true)
    } else {
      setNoActive(false)
    }
  }, []);

  const selectVar = (id: number) => {
    vars.map((item) => {
      if (item.id === id) {
        setCurrentVar(item)
        setVarBlock(item)
      }
    });

    setModalFlag(3);
    open();
  };

  const deleteVar = (id: number) => {
    vars.map((item) => {
      if (item.id === id) {
        setCurrentVar(item)
        setVarModal(item)
      }
    });

    setModalFlag(2);
    open();
  };

  return (
    <>
      <div className="row" style={{padding: "0px", margin: "0px"}}>

        <div className="col-9" style={{textAlign: "left", padding: "0px", margin: "0px"}}>
          <h5>Шаблонные переменные</h5>
        </div>

        {!noactive &&
          <div className="col-3" style={{ textAlign: "right", padding: "0px", margin: "0px" }}>
            <button className="btn btn-success btn-sm" onClick={() => {setModalFlag(1);open();setVarBlock({
              id: 0,
              name:"",
              placeholder:"",
              data:[]
            })}}>Создать новую переменную</button>
          </div>}

      </div>

      <div className="list-group" style={{ margin: "10px 0px 0px 0px", height: files.length ? "80vh" : "", overflowY: files.length < 10 ? "visible" : "scroll"}}>
        {files.length === 0 ?
        <div className={message ? "alert alert-warning" : cookies["token"] ? "alert alert-info" : "alert alert-danger"}>
          {message ? message : cookies["token"] ? "Шаблоные переменные пока не загружены" : "Необходима авторизация"}
        </div>:
        vars.map((item, index) => (
            <VarBlock item={item} index={index} selectVar={selectVar} deleteVar={deleteVar}/>
        ))}
      </div>
    </>
  );
};

export default VarList;
