import "bootstrap/dist/css/bootstrap.min.css";

import FileUpload from "./FileUpload";
import TableTemplate from "./TableTamplate";
import FileDownload from "./FileDownload";

type GeneralInterface = {
  step: number
}

const General = ({step}:GeneralInterface) => {
  return (
    // <TemplateState>
        <div className="container" style={step === 1 ? { width: "700px" } : { width: "600px" }}>
          <div className="my-3">
            {step === 0 && <h4>Загрузите файл </h4>}
            {step === 1 && <h4>Укажите значения для замены</h4>}
            {step === 2 && <h4>Скачайте готовый файл</h4>}
          </div>

          {step === 0 && <FileUpload/>}
          {step === 1 && <TableTemplate/>}
          {step === 2 && <FileDownload/>}

        </div>
    // </TemplateState>
  );
};

export default General;