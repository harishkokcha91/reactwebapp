import { useState, useEffect } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import ApiUrl from '@/config/api-url';
import { getToken } from '@/utils/request';
import { message } from 'antd';
import { useUserStore } from '@/store/user';

const UserInfoForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([])
  const initUserInfo = useUserStore((state)=>state.initUserInfo)
  const updateUserInfo = useUserStore((state) => state.updateUserInfo)


  useEffect(() => {
    async function getUserInfo() {
      const data = await initUserInfo()
      if (data) {
        form.setFieldsValue(data ?? {})
        // Show pictures
        const {avatar_url} = data
        const fileList = [
          {
            status: 'done',
            url: avatar_url,
          },
        ]

        setFileList(fileList)
      }
    }

    getUserInfo()
  }, [form, initUserInfo])

  const handleSubmit = async (values) => {
    console.log('values---', values)
    const data = await updateUserInfo(values)
    console.log('data update', data)
    message.success('update completed!')
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
    if (info.file.status === 'done') {
      const { data } = info.file.response
      if (data?.filePath) {
        const imgUrl = `${ApiUrl.ManApiUrl}${data.filePath.replace("public", "")}`
        form.setFieldsValue({
          avatar_url: imgUrl,
        });
      }

    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return ApiUrl.ManApiUrl + '/' + e?.file?.response?.data?.filePath;
  };


  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="user name"
        name="name"
        rules={[{ required: true, message: 'Please enter user name!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Name" />
      </Form.Item>

      <Form.Item
        label="Nick name"
        name="nick_name"
      >
        <Input prefix={<UserOutlined />} placeholder="Nickname" />
      </Form.Item>

      <Form.Item
        label="role type"
        name="user_type"
        initialValue={1}
      >
        <Radio.Group>
          <Radio value={0}>super administrator</Radio>
          <Radio value={1}>other</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="avatar"
        name="avatar_url"
        getValueFromEvent={normFile}
      >
        <Upload
          name="file"
          action={`${ApiUrl.ManApiUrl}/file/upload`}
          headers={
            {
              Authorization: getToken(),
            }
          }
          onChange={handleUploadChange}
          listType="picture-card"
          showUploadList={false}
          fileList={fileList}
        >
          {form.getFieldValue('avatar_url') ? (
            <img src={form.getFieldValue('avatar_url')} alt="avatar" style={{ width: '100%' }} />
          ) : (
            <Button icon={<UploadOutlined />}></Button>
          )}
        </Upload>
      </Form.Item>

      <Form.Item
        label="sign"
        name="signature"
      >
        <Input.TextArea placeholder="Signature" />
      </Form.Item>

      <Form.Item
        label="gender"
        name="gender"
        initialValue="other"
      >
        <Radio.Group>
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
          <Radio value="other">other</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserInfoForm;
