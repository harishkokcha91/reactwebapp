import ApiUrl from "@/config/api-url";
import { deleteFile, deleteOssFile } from "@/services/upload";
import { fetchUploadList } from "@/services/websit";
import { getToken } from "@/utils/request";
import { formatDate } from "@/utils/utils";
import { UploadOutlined } from "@ant-design/icons";
import { Select, Form, Button, Card, message, Table, Upload, Modal } from "antd";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

const { confirm } = Modal;

export default function FileAdmin() {
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [uploadFileType, setUploadFileType] = useState(2);
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => <p>Total {total} pieces of data</p>,
  });

  const fileUploadTypeOptions = [
    { value: 2, label: 'OSS Upload' },
    { value: 1, label: 'Local Upload' },
  ];

  const byte2kb = (val) => (val / 1024).toFixed(2);

  const setFileUrl = (record) => {
    return record?.type === 2
      ? record.filePath
      : `${ApiUrl.ManApiUrl}${record.filePath.replace("public", "")}`;
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
    },
    {
      title: "Preview",
      width: 100,
      render: (text, record) => (
        <div>
          <img alt="" style={{ width: 50 }} src={setFileUrl(record)} />
        </div>
      ),
    },
    {
      title: "File Path",
      width: 500,
      ellipsis: true,
      render: (text, record) => (
        <CopyToClipboard
          text={setFileUrl(record)}
          onCopy={() => message.success("Text copied successfully!")}
        >
          <span style={{ cursor: "pointer" }}>{setFileUrl(record)}</span>
        </CopyToClipboard>
      ),
    },
    {
      title: "File Size",
      dataIndex: "size",
      render: (text) => `${byte2kb(text)}kb`,
    },
    {
      title: "Upload Date",
      dataIndex: "upload_date",
      render: (text) => <span>{formatDate(text)}</span>,
    },
    {
      title: 'Actions',
      key: 'operation',
      width: 150,
      render: (text, record) => (
        <div>
          <Button onClick={() => handleDeleteFile(record.name, record.type, record._id)}>Delete</Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchTableData(paginationConfig);
  }, [paginationConfig]);

  const fetchTableData = async (pagination) => {
    setTableLoading(true);
    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    };
    const res = await fetchUploadList(params);
    setTableLoading(false);
    const { data } = res;
    if (Array.isArray(data.data)) {
      setTableData(data.data);
      setTotal(data?.count || 0);
    }
  };

  const handleTableChange = (pagination) => {
    setPaginationConfig({
      ...paginationConfig,
      ...pagination,
    });
  };

  const uploadProps = {
    name: 'file',
    maxCount: 1,
    action: uploadFileType === 1 ? `${ApiUrl.ManApiUrl}/file/upload` : `${ApiUrl.ManApiUrl}/oss/upload`,
    headers: {
      Authorization: getToken(),
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success('File uploaded successfully!');
        fetchTableData(paginationConfig);
      } else if (info.file.status === 'error') {
        message.error('File upload failed');
      }
    },
  };

  const handleSelectChange = (value) => {
    setUploadFileType(value);
  };

  const handleDeleteFile = async (fileName, type, fileId) => {
    confirm({
      title: "Warning!",
      content: "Are you sure you want to delete this file?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        let res = null;
        if (type === 2) {
          res = await deleteOssFile(fileName, fileId);
        } else {
          res = await deleteFile(fileId);
        }
        if (res.code === 200) {
          message.success("File deleted successfully!");
          fetchTableData(paginationConfig);
        } else {
          message.error("Failed to delete file");
        }
      },
      onCancel() {},
    });
  };

  return (
    <Card>
      <div style={{ marginBottom: '6px' }}>
        <Form layout="inline">
          <Form.Item label="Upload Type">
            <Select
              defaultValue={uploadFileType}
              options={fileUploadTypeOptions}
              onChange={handleSelectChange}
            />
          </Form.Item>
          <Form.Item>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </div>
      <Table
        rowKey={(record) => record._id}
        dataSource={tableData}
        columns={columns}
        pagination={{ ...paginationConfig, total }}
        loading={tableLoading}
        onChange={handleTableChange}
      />
    </Card>
  );
}
