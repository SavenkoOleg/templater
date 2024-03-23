import "bootstrap/dist/css/bootstrap.min.css";

export type IFile = {
  id: number;
  filename: string;
};

type TemplBlockInterface = {
  item: IFile;
  index: number;
  selectFile: (id: number) => void;
  deleteFile: (id: number) => void;
};

const FileBlock = ({
  item,
  index,
  selectFile,
  deleteFile,
}: TemplBlockInterface) => {

  return (
      <div className="file-block row" key={index} style={{marginLeft: "5px", marginRight: "5px"}}>
        <label
          className="col-10"
          style={{ textAlign: "left", paddingBottom: "0px" }}
        >
          {item.filename}
        </label>

        <div className="col-2" style={{display: "flex", flexDirection: "row-reverse"}}>
          <div
            className="hover-icon button_file"
            onClick={() => deleteFile(item.id)}
          >
            <label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash trash-icon"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
              </svg>
            </label>
          </div>
          <div
            className="hover-icon button_file"
            onClick={() => selectFile(item.id)}
            style={{marginRight: "5px"}}
          >
            <label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-box-arrow-in-up-right templ-icon"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.364 13.5a.5.5 0 0 0 .5.5H13.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 13.5 1h-10A1.5 1.5 0 0 0 2 2.5v6.636a.5.5 0 1 0 1 0V2.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H6.864a.5.5 0 0 0-.5.5"
                />
                <path
                  fill-rule="evenodd"
                  d="M11 5.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793l-8.147 8.146a.5.5 0 0 0 .708.708L10 6.707V10.5a.5.5 0 0 0 1 0z"
                />
              </svg>
            </label>
          </div>
        </div>
      </div>
  );
};

export default FileBlock;
