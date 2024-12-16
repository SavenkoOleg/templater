import { useState, useContext } from "react";
import UploadService from "../services/FileUploadService";
import {IDataVar, IVar, IVarP, TemplateContext} from "../context/TemplateContext";
import TemplaterService from "../services/TemplaterService";
import { useCookies } from 'react-cookie';
import FileBlock from "./FileBlock";

const maxBlocks = 10

const NewVar: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(true);
    const [, setTick] = useState(0);

  const {varnn, setVarBlock} = useContext(TemplateContext)
    const [countBlock, setCountBlock] = useState<number>(maxBlocks - varnn.data.length);
  // const [cookies] = useCookies(['token']);

    const forceUpdate = () => setTick(tick => tick + 1);

  const addVarValue = () => {
      if (varnn.data.length < maxBlocks) {
          varnn.data.push({
              "id": varnn.data.length,
              "text": ""
          })

          setVarBlock(varnn)
          setCountBlock(maxBlocks - varnn.data.length)
      } else {
          setMessage("Можно добавить только "+maxBlocks+" значений")
      }
  };

    const [valueName, setValueName] = useState<string>(varnn.name);
    const [valuePlaceholder, setValuePlaceholder] = useState<string>(varnn.placeholder);
    const changeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        let tmp: IVarP = varnn

        switch (name) {
            case "name":
                setValueName(value)
                tmp.name = value
                setVarBlock(tmp)
                break
            case "placeholder":
                tmp.placeholder = value
                setValuePlaceholder(value)
                setVarBlock(tmp)
                break
            default:
                let id = parseInt(name.split("-")[1])
                // eslint-disable-next-line array-callback-return
                tmp.data.map((item:IDataVar) => {
                    if (item.id === id) {
                        item.text = value
                    }
                })
                setVarBlock(tmp)
                forceUpdate()
        }

        setVarBlock(tmp)
    }

  const deleteVarValue = (id: number) => {
      let tmp: IVarP;
      if (varnn.data.length > 0) {
          tmp = varnn
          tmp.data = varnn.data.filter((item: IDataVar) => item.id !== id)
          setVarBlock(tmp)
          setCountBlock(maxBlocks - tmp.data.length)
      }
  };

  return (
      <div>
          <div className="row" style={{marginBottom: "5px"}}>
              <div className="col-6">
                  <input
                      type="text"
                      name="name"
                      placeholder="Введите название"
                      className="form-control"
                      value={valueName}
                      onChange={changeHandler}
                  />
              </div>
              <div className="col-6">
                  <input
                      type="text"
                      name="placeholder"
                      placeholder="Введите шаблон"
                      className="form-control"
                      value={valuePlaceholder}
                      onChange={changeHandler}
                  />
              </div>
          </div>

          {varnn.data.map((item: IDataVar) => (
              <div className="var-block row" key={item.id} style={{marginLeft: "5px", marginRight: "5px"}}>
                  <div className="col-11" style={{paddingLeft: "0px", paddingRight: "5px"}}>
                          <input
                              type="text"
                              name={"var-"+item.id}
                              value={item.text}
                              placeholder="Введите текст для замены"
                              className="form-control"
                              onChange={changeHandler}
                          />
                      </div>

                  <div className="col-1" style={{
                          display: "flex",
                          flexDirection: "row-reverse",
                          paddingLeft: "0px",
                          paddingRight: "0px",
                          marginTop: "3px"
                      }}>
                      <div className="hover-icon button_file" onClick={() => deleteVarValue(item.id)}>
                              <label>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-trash trash-icon"
                                      viewBox="0 0 16 16"
                                  >
                                      <path
                                          d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                      <path
                                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                  </svg>
                              </label>
                          </div>
                  </div>
              </div>
          ))}

          <div className="row" style={{marginTop: "10px"}}>
              <div className="col-12">
                  <button className="btn btn-success btn-sm" onClick={() => addVarValue()}>Добавить значение ({countBlock})</button>
              </div>
          </div>

          {message && (<div className={success ? "alert alert-success mt-3" : "alert alert-warning mt-3"}>{message}</div>)}
      </div>
  );
};

export default NewVar;
