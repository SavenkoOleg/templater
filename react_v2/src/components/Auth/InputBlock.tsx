import "bootstrap/dist/css/bootstrap.min.css";

type InputInterface = {
  name: string;
  type: string;
  index: number;
  placeholder: string;
  changeHandler: (event: React.FormEvent<HTMLInputElement>)  => void;
};

const InputBlock = ({ name, type, index, placeholder, changeHandler }: InputInterface) => {
  return (
  <div className="col-12" key={index}>
    <div className="form-floating mb-3">
      <input
        type={type}
        className="form-control"
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={changeHandler}
        required
      />
    </div>
  </div>
  );
};

export default InputBlock;
