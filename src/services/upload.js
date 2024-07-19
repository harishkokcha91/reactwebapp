import request from "@/utils/request";

export async function uploadFile(formdata) {
  return request("/file/upload", {
    method: "POST",
    data: formdata,
    headers: {
      "Content-type": "multipart/form-data",
    },
  });
}

// Upload oss ​​file
export async function uploadOssFile(formdata) {
  return request("/oss/upload", {
    method: "POST",
    data: formdata,
    headers: {
      "Content-type": "multipart/form-data",
    },
  });
}

// Delete oss file
export async function deleteOssFile(fileNames = '', fileId = '') {
  return request("/oss/delete", {
    method: "POST",
    data: {
      fileNames: fileNames,
      id: fileId
    }
  });
}

// Delete Files
export async function deleteFile(fileId = '') {
  return request("/file/delete", {
    method: "POST",
    data: {
      id: fileId
    }
  });
}
