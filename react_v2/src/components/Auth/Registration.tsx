import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TemplaterService, { IAuthRegistrData } from "../../services/TemplaterService";
import WrapperAuth from "./WrapperAuth";
import InputBlock from "./InputBlock";
import LinkBlock from "./LinkBlock";

const Registration = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<IAuthRegistrData>({
    email: "",
    password: "",
    confirm_password: ""
  });

  const [message, setMessage] = useState<string>("");

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

  const registr = () => {
    console.log(data)
    TemplaterService.reg(data)
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

  const changeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setData({ ...data, [event.currentTarget.name]: event.currentTarget.value });
  };

  return (
    <WrapperAuth title="Регистрация">
        <div className="row gy-2 overflow-hidden"> 
          <InputBlock name="email" index={1} placeholder="Email" changeHandler={changeHandler}/>
          
          <InputBlock name="password" index={1} placeholder="Пароль" changeHandler={changeHandler}/>
          
          <InputBlock name="confirm_password" index={1} placeholder="Повторите пароль" changeHandler={changeHandler}/>

          <LinkBlock link="log" text="У меня уже есть аккаунт" handleClick={handleClick}/>

          <div className="col-12">
            {message && (<div className="alert alert-warning">{message}</div>)}
          </div>

          <div className="col-12">
            <div className="d-grid my-3">
              <button className="btn btn-primary btn-lg" onClick={registr}>
                Зарегистрироваться
              </button>
            </div>
          </div>

        </div>
    </WrapperAuth>
  );
};

export default Registration;
