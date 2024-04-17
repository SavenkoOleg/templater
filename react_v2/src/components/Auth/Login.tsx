import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import TemplaterService, { IAuthData } from "../../services/TemplaterService";
import { useState } from "react";
import WrapperAuth from "./WrapperAuth";
import InputBlock from "./InputBlock";

const Login = () => {
  const navigate = useNavigate();

  const [, setCookie] = useCookies(["token"]);

  const [message, setMessage] = useState<string>("");

  const [data, setData] = useState<IAuthData>({
    email: "",
    password: "",
  });

  function handleClick(path: string) {
    switch (path) {
      case "reg":
        navigate("/registration");
        break;
      case "rec":
        navigate("/recovery");
        break;
      case "log":
        navigate("/");
        break;
      case "res":
        navigate("/reset");
        break;
      default:
        navigate("/");
    }
  }

  const login = () => {
    TemplaterService.login(data)
      .then((res) => {
        if (res.data.success) {
          setCookie("token", res.data.result);
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
    <WrapperAuth title="Авторизация">
        <div className="row gy-2 overflow-hidden">
          <InputBlock name="email" type="email" index={1} placeholder="Email" changeHandler={changeHandler}/>
          
          <InputBlock name="password" type="password" index={2} placeholder="Пароль" changeHandler={changeHandler}/>

          <div className="col-12">
            {message && (<div className="alert alert-warning">{message}</div>)}
          </div>

          <div className="col-12">
            <div className="d-flex gap-2 justify-content-between">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  name="rememberMe"
                  id="rememberMe"
                />

                <label className="form-check-label text-secondary">
                  Не выходить из системы
                </label>
              </div>
                <a
                  onClick={() => handleClick("rec")}
                  className="link-primary text-decoration-none"
                >
                Забыли пароль?
              </a>
            </div>
          </div>

          <div className="col-12">
            <div className="d-grid my-3">
              <button className="btn btn-primary" onClick={login}>
                Войти
              </button>
            </div>
          </div>

          {/* <div className="col-12">
            <div className="d-grid my-3">
              <button className="btn btn-primary" onClick={() => handleClick("res")}>
                Восстановление
              </button>
            </div>
          </div> */}

          <div className="col-12">
            <p className="m-0 text-secondary text-center">
              У Вас нет аккаунта?&nbsp;
              <a
                onClick={() => handleClick("reg")}
                className="link-primary text-decoration-none"
              >
                Зарегистрируйте
              </a>
            </p>
          </div>

        </div>
    </WrapperAuth>
  );
};

export default Login;
