import http from "../http-common";

export type ITemplDate = {
  key: string,
  value: string
}

export type ITemplater = {
  file_name_input: string,
  file_name_output: string,
  templ_date: ITemplDate[]
}

const templ = (templ: ITemplater): Promise<any> => {
  return http.post("/tmp/templ", templ);
};

const scan = (filename: string): Promise<any> => {
  return http.post("/tmp/scan", {file_name_input: filename});
};


const FileUploadService = {
  templ,
  scan,
};

export default FileUploadService;
