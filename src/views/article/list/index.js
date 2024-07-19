import { deleteArticle, queryArticleList } from "@/services/article";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/utils";
import { Table, Button, Tag, message, Modal } from "antd";
import ApiUrl from "@/config/api-url";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

export default function ArticleList() {
  const navigate = useNavigate();
  const [articleList, setArticleList] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => (
      <>
        <p>Total {total} items</p>
      </>
    ),
  });

  const columns = [
    {
      title: "Article Title",
      dataIndex: "title",
      width: 200,
      ellipsis: true,
      render: (text, record) => (
        <>
          <a
            href={`${ApiUrl.StaticUrl}/article/detail/${record.uuid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text}
          </a>
        </>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Tags",
      key: "tags",
      render: (text, record) => (
        <span>
          {record.tags.map((tag) => (
            <Tag key={tag._id}>{tag.name}</Tag>
          ))}
        </span>
      ),
    },
    {
      title: "Views",
      dataIndex: "meta",
      render: (text) => <span>{text.views}</span>,
    },
    {
      title: "Created Time",
      dataIndex: "create_time",
      render: (text) => <span>{formatDate(text)}</span>,
    },
    {
      title: "Updated Time",
      dataIndex: "update_time",
      render: (text) => <span>{formatDate(text)}</span>,
    },
    {
      title: "Actions",
      width: 150,
      render: (text, record) => (
        <div>
          <Button
            onClick={() => goEditArticle(record.uuid)}
            type="dashed"
            size="small"
            style={{ marginRight: "8px" }}
          >
            Edit
          </Button>
          <Button
            onClick={() => deleteArticleHandle(record.uuid)}
            type="danger"
            size="small"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const getArticle = async () => {
      setTableLoading(true);
      const params = {
        pageNo: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
      };
      const res = await queryArticleList(params);
      setTableLoading(false);
      const { data } = res;
      if (Array.isArray(data.data)) {
        setArticleList(data.data);
        setTotal(data?.count || 0);
      }
    };
    getArticle();
  }, [paginationConfig]);

  const getArticleHandle = async () => {
    setTableLoading(true);
    const params = {
      pageNo: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    };
    const res = await queryArticleList(params);
    setTableLoading(false);
    const { data } = res;
    if (Array.isArray(data.data)) {
      setArticleList(data.data);
      setTotal(data?.count || 0);
    }
  };

  const handleTableChange = (pagination) => {
    setPaginationConfig({
      ...paginationConfig,
      ...pagination,
    });
  };

  const gotoAddArticle = () => {
    navigate("/article/add");
  };

  function goEditArticle(uuid) {
    navigate(`/article/add?uuid=${uuid}`);
  }

  function deleteArticleHandle(uuid) {
    confirm({
      title: "Warning!",
      content: "Are you sure you want to delete this article?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteArticle(uuid).then((res) => {
          if (res.code === 200) {
            message.success("Deleted successfully!");
            getArticleHandle();
          } else {
            message.error("Failed to delete");
          }
        });
      },
      onCancel() {},
    });
  }

  return (
    <div>
      <div className="layout-header">
        <Button onClick={gotoAddArticle} type="primary">
          Add New
        </Button>
      </div>
      <Table
        rowKey={(record) => record._id}
        dataSource={articleList}
        columns={columns}
        pagination={{ ...paginationConfig, total }}
        onChange={handleTableChange}
        loading={tableLoading}
      ></Table>
    </div>
  );
}
