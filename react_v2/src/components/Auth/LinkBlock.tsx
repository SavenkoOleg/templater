import "bootstrap/dist/css/bootstrap.min.css";

type LinkInterface = {
  link: string;
  text: string;
  handleClick: (path: string) => void;
};

const LinkBlock = ({
  link,
  text,
  handleClick,
}: LinkInterface) => {
  return (
    <div className="col-12">
      <div className="d-flex gap-2 justify-content-between">
        <a
          onClick={() => handleClick(link)}
          className="link-primary text-decoration-none"
        >
          {text}
        </a>
      </div>
    </div>
  );
};

export default LinkBlock;
