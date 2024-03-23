import http from "../http-common";

const upload = (file: File, token: string, onUploadProgress: any): Promise<any> => {
  let formData = new FormData();

  formData.append("file", file);

  return http.post("/api/v2/document/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`,
    },
    onUploadProgress,
  });
};

const FileUploadService = {
  upload,
};

export default FileUploadService;
