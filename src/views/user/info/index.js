import { Col } from "antd";
import { Row } from "antd";
import { Card } from "antd";
import UserInfoForm from "./components/userInfoForm";

export default function UserInfo(){
  return (
   <Card title="User Info" bordered={false}>
    <Row>
      <Col span={12}>
        <UserInfoForm />
      </Col>
    </Row>
   </Card>
  )
}
