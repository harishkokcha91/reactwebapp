import request from '@/utils/request';

/**
 * Get file upload list
 * @param {*} param0
 */
export async function fetchUploadList({ pageNo = 1, pageSize = 10 } = {}) {
  return request('/file/list', {
    method: 'GET',
    params: {
      pageNo,
      pageSize,
    },
  });
}

/**
 * Get visitor list
 * @param {*} param0
 */
export async function fetchVisitorList({ pageNo = 1, pageSize = 10 } = {}) {
  return request('/visitor', {
    method: 'GET',
    params: {
      pageNo,
      pageSize,
    },
  });
}

/**
 * Get list of comments
 * @param {*} param0
 */
export async function fetchCommentList({ pageNo = 1, pageSize = 10 } = {}) {
  return request('/comment', {
    method: 'GET',
    params: {
      pageNo,
      pageSize,
    },
  });
}

/**
 * Delete comment
 * @param {*} _id
 */
export async function deleteCommentById(_id) {
  return request('/comment/delete', {
    method: 'GET',
    params: {
      _id,
    },
  });
}
