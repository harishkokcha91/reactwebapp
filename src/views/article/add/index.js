import ApiUrl from "@/config/api-url";
import {
  addArticle,
  fetchArticleDetail,
  fetchTags,
  updateArticle,
} from "@/services/article";
import { uploadFile, uploadOssFile } from "@/services/upload";
import { replaceHtml } from "@/utils/utils";
import { Select } from "antd";
import { Button, Checkbox, Form, Input, message, Radio } from "antd";
import Editor from "for-editor";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import marked from "./marked";

const defaultFormValue = {
  type: 1,
  private: 0,
};

const toolbar = {
  img: true, // Image
  link: true, // Link
  code: true, // Code block
  preview: true, // Preview
  expand: true, // Fullscreen
  undo: true, // Undo
  redo: true, // Redo
  save: true, // Save
  subfield: true, // Single/Double column mode
};

const AddArticle = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const editorRef = useRef(null);
  const formRef = useRef(null);
  const uuid = searchParams.get("uuid");
  const [uploadFileType, setUploadFileType] = useState(2);

  // Switch file upload type
  const handleSelectChange = (value) => {
    setUploadFileType(value);
  };

  const fileUploadTypeOptions = [
    { value: 2, label: 'OSS Upload' },
    { value: 1, label: 'Local Upload' },
  ];

  useEffect(() => {
    fetchTags().then((res) => {
      if (res.code === 200) {
        setTags(res.data);
      }
    });
  }, []);

  useEffect(() => {
    async function getArticleDetail() {
      if (uuid) {
        const res = await fetchArticleDetail(uuid);
        setArticleDetail(res?.data || {});
      }
    }
    getArticleDetail();
  }, [uuid]);

  const setArticleDetail = (data) => {
    formRef.current?.setFieldsValue({
      title: data.title,
      selectedTags: data.tags.map(tag => tag.name),
      private: data.private,
      type: data.type,
      markdown: data.markdown,
    });
  };

  const onFinish = (values) => {
    console.log("values--", values);
    const tags = values.selectedTags.map((tag) => ({ name: tag }));
    const renderValue = marked(values.markdown);
    const content = renderValue.html;
    const { toc } = renderValue;
    const params = {
      ...values,
      tags,
      content,
      toc,
    };
    // Article excerpt
    const excerptStr = replaceHtml(content.slice(0, 200));
    params.excerpt =
      excerptStr.length > 137 ? `${excerptStr.slice(0, 137)}...` : excerptStr;

    requestSubmitHandle(params);
  };

  const requestSubmitHandle = (params) => {
    if (uuid) {
      // Update article
      updateArticle(uuid, params).then((res) => {
        if (res.code === 200) {
          message.success("Article updated successfully!");
          navigate("/article/list");
        } else {
          message.error("Failed to update article!");
        }
      });
    } else {
      // Add new article
      addArticle(params).then((res) => {
        if (res.code === 200) {
          message.success("Article added successfully!");
          navigate("/article/list");
        } else {
          message.error(res.msg);
        }
      });
    }
  };

  // Set file URL
  const setFileUrl = (type, filePath = '') => {
    // OSS URL
    if (type === 2) {
      return filePath;
    } else {
      // Local upload URL
      return `${ApiUrl.ManApiUrl}${filePath.replace("public", "")}`;
    }
  };

  // Upload image
  const addImg = ($file) => {
    const formData = new FormData();
    formData.append("file", $file);
    let uploadFun = () => { };
    if (uploadFileType === 2) {
      uploadFun = uploadOssFile;
    } else {
      uploadFun = uploadFile;
    }
    uploadFun(formData)
      .then((res) => {
        console.log("up", res);
        if (res.code === 200) {
          const filePath = setFileUrl(uploadFileType, res?.data?.filePath);
          editorRef.current.$img2Url($file.name, filePath);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Form
        name="article-form"
        onFinish={onFinish}
        initialValues={defaultFormValue}
        ref={formRef}
        labelCol={{ span: 2 }}
      >
        <Form.Item label="Image Upload Type">
          <Select
            defaultValue={uploadFileType}
            options={fileUploadTypeOptions}
            onChange={handleSelectChange}
          />
        </Form.Item>

        <Form.Item
          label="Article Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please enter the article title",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Article Tags" name={"selectedTags"}>
          <Checkbox.Group>
            {tags.map((tag) => (
              <Checkbox key={tag._id} value={tag.name}>
                {tag.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item label="Is Public" name={"private"}>
          <Radio.Group>
            <Radio value={0}>Public</Radio>
            <Radio value={1}>Private</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Is Original" name={"type"}>
          <Radio.Group>
            <Radio value={1}>Original</Radio>
            <Radio value={2}>Repost</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Article Content" name={"markdown"}>
          <Editor
            height="300px"
            toolbar={toolbar}
            ref={editorRef}
            addImg={addImg}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddArticle;
