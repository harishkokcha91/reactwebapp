import { userUpdatePassword } from "@/services/user";
import storage from "@/utils/storage";
import { Button, Card, Form, Input } from "antd";
import { message } from "antd/es";
import { useNavigate } from "react-router-dom";

export default function Password() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const res = await userUpdatePassword(values)
    const { code } = res
    if (code === 200) {
      messageApi.open({
        type: 'success',
        content: 'password has been updated!',
      })
      // Remove token
      storage.remove('token')

      setTimeout(() => {
        navigate('/login')
      }, 1000);

    }
  };

  return (
    <Card title='change Password' bordered={false}>
      {contextHolder}
      <Form labelCol={{ span: 2 }} onFinish={onFinish}>
        <Form.Item
          name='oldPassword'
          label='old password'
          rules={[{ required: true, message: 'Please enter the original password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name='newPassword'
          label='New Password'
          rules={[{ required: true, message: 'Please enter a new password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name='confirmPassword'
          label='Enter password again'
          dependencies={['newPassword']} // Rely on new password field
          rules={[
            {
              required: true,
              message: 'Please enter new password again!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The passwords entered twice are inconsistent'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
          <Button type="primary" htmlType="submit">
          Sure
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
