import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TemplaterService, { IAuthRecoveryData } from "../../services/TemplaterService";
import WrapperAuth from "./WrapperAuth";
import InputBlock from "./InputBlock";
import LinkBlock from "./LinkBlock";

const Reset = () => {
  const [data, setData] = useState<IAuthRecoveryData>({
    email: ""
  });

  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  function handleClick(path: string) {
    switch (path) {
      case "log":
        navigate("/login");
        break;
      case "rec":
        navigate("/recovery");
        break;
      default:
        navigate("/");
    }
  }

  const changeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setData({ ...data, [event.currentTarget.name]: event.currentTarget.value });
  };

  const recovery = () => {
    TemplaterService.recovery(data)
      .then((res) => {
        if (res.data.success) {
          handleClick("log");
        } else {
          console.log(res.data)
          setMessage(res.data.error)
        }
      })
      .catch(() => {
      });
  };

  return (
    <WrapperAuth title="Смена пароля">
        <div className="row gy-2 overflow-hidden">
          <InputBlock name="password" index={1} placeholder="Новый пароль" changeHandler={changeHandler}/>
          <InputBlock name="password" index={2} placeholder="Повторите пароль" changeHandler={changeHandler}/>

          <LinkBlock link="log" text="Я помню пароль" handleClick={handleClick}/>
          
          <div className="col-12">
            {message && (<div className="alert alert-warning">{message}</div>)}
          </div>

          <div className="col-12">
            <div className="d-grid my-3">
              <button className="btn btn-primary btn-lg" onClick={recovery}>
                Изменить пароль
              </button>
            </div>
          </div>
          
        </div>
    </WrapperAuth>
  );
};

export default Reset;
