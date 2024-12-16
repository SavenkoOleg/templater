import http from "../http-common";
import {IVarP} from "../context/TemplateContext";
// import ColumnsI from "../components/TableTamplate"

export type ITemplDate = {
  key: string,
  value: string
}

export type IAuthData = {
  email: string,
  password: string
}

export type IAuthRegistrData = {
  email: string,
  password: string
  confirm_password: string
}

export type IAuthRecoveryData = {
  email: string
}

export type IAuthResetData = {
  password: string
  confirm_password: string
  code: string
}

export type ITemplater = {
  file_name_input: string,
  document_id: number,
  file_name_output: string,
  props: ITemplDate[]
}

const templ = (token: string, templ: ITemplater): Promise<any> => {
  return http.post("/api/v2/document/templ", templ, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const login = (authData: IAuthData): Promise<any> => {
  return http.post("/api/v2/user/login", authData);
};

const recovery = (authData: IAuthRecoveryData): Promise<any> => {
  return http.post("/api/v2/user/recovery", authData);
};

const reset = (authData: IAuthResetData): Promise<any> => {
  return http.post("/api/v2/user/reset", authData);
};

const reg = (authData: IAuthRegistrData): Promise<any> => {
  return http.post("/api/v2/user/reg", authData);
};

const scan = (id: number, token: string): Promise<any> => {
  return http.post("/api/v2/document/scan",{id: id}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const deleteFile = (document_id: number, token: string): Promise<any> => {
  return http.post("/api/v2/document/delete",{document_id: document_id}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const saveProps = (token: string, document_id: number, columns: any[]): Promise<any> => {
  return http.post("/api/v2/document/props/update",{props: columns, document_id:document_id}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const getFiles = (token: string): Promise<any> => {
  return http.get("/api/v2/documents/get", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

const varCreate = (token: string, varn: IVarP): Promise<any> => {
  return http.post("/api/v2/vars/create",{name:varn.name, placeholder:varn.placeholder, data: varn.data}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const varDelete = (token: string, id: number): Promise<any> => {
  return http.post("/api/v2/vars/delete",{id:id}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const varUpdate = (token: string, varn: IVarP): Promise<any> => {
  return http.post("/api/v2/vars/update",{id:varn.id, name:varn.name, placeholder:varn.placeholder, data: varn.data}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const varGet = (token: string): Promise<any> => {
  return http.get("/api/v2/vars/get", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const Services = {
  templ,
  scan,
  login,
  getFiles,
  recovery,
  reg,
  deleteFile,
  saveProps,
  reset,
  varCreate,
  varDelete,
  varUpdate,
  varGet,
};

export default Services;
