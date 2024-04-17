import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TemplaterService, { IAuthRecoveryData } from "../../services/TemplaterService";
import WrapperAuth from "./WrapperAuth";
import InputBlock from "./InputBlock";
import LinkBlock from "./LinkBlock";

const Recovery = () => {
  const [data, setData] = useState<IAuthRecoveryData>({
    email: ""
  });

  const [message, setMessage] = useState<string>("");
  const [state, setState] = useState<boolean>(false);

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
          setState(true)
        } else {
          setMessage(res.data.error)
        }
      })
      .catch(() => {
      });
  };

  return (
    <WrapperAuth title="Восстановление">
        <div className="row gy-2 overflow-hidden">
          {!state ? 
          <>
            <InputBlock name="email" type="email" index={1} placeholder="Email" changeHandler={changeHandler}/>
            <div className="col-12">
              {message && (<div className="alert alert-warning">{message}</div>)}
            </div>
            <LinkBlock link="log" text="Я помню пароль" handleClick={handleClick}/>

            <div className="col-12">
              <div className="d-grid my-3">
                <button className="btn btn-primary" disabled={!data.email.length} onClick={recovery}>
                  Отправить запрос
                </button>
              </div>
            </div>

          </> : 
          <>
            <div className="alert alert-primary">Сслыка для восстановления отправлена на почту</div>
            
            <div className="col-12">
              <div className="d-grid my-3">
                <button className="btn btn-primary" onClick={() => handleClick("log")}>
                  Перейти к авторизации
                </button>
              </div>
            </div>
          </>
          }

          
          
        </div>
    </WrapperAuth>
  );
};

export default Recovery;
