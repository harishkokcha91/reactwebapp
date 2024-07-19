import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Space, Pagination } from 'antd';
import axios from 'axios';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'describe',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'operate',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const ExampleTable = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = useCallback(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${pagination.current}&_limit=${pagination.pageSize}`)
      .then(response => {
        setData(response.data);
        setPagination({...pagination, total: response.headers['x-total-count']});
      })
      .catch(error => {
        console.log(error);
      });
  }, [pagination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePaginationChange = useCallback((page, pageSize) => {
    setPagination(prevPagination => ({...prevPagination, current: page, pageSize: pageSize}));
  }, []);

  const memoizedPagination = useMemo(() => ({
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total
  }), [pagination]);

  return (
    <div>
      <Table columns={columns} dataSource={data} pagination={false} />
      <Pagination {...memoizedPagination} onChange={handlePaginationChange} />
    </div>
  );
}

export default ExampleTable;
