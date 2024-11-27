import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const AddProduct = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        price: values.price,
        category: values.category,
        translations: [
          {
            language: 'en',
            name: values.name_en,
            description: values.description_en,
          },
          {
            language: 'th',
            name: values.name_th,
            description: values.description_th,
          },
        ],
      };
      await axios.post('http://localhost:3000/products', payload);
      message.success('Product added successfully');
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Add New Product</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please enter the price' }]}
        >
          <Input type="number" placeholder="Enter price" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Input placeholder="Enter Category" />
        </Form.Item>

        <Form.Item
          label="Name (English)"
          name="name_en"
          rules={[{ required: true, message: 'Please enter the English name' }]}
        >
          <Input placeholder="Enter English name" />
        </Form.Item>

        <Form.Item
          label="Description (English)"
          name="description_en"
          rules={[
            { required: true, message: 'Please enter the English description' },
          ]}
        >
          <Input.TextArea placeholder="Enter English description" rows={4} />
        </Form.Item>

        <Form.Item
          label="Name (Thai)"
          name="name_th"
          rules={[{ required: true, message: 'Please enter the Thai name' }]}
        >
          <Input placeholder="Enter Thai name" />
        </Form.Item>

        <Form.Item
          label="Description (Thai)"
          name="description_th"
          rules={[
            { required: true, message: 'Please enter the Thai description' },
          ]}
        >
          <Input.TextArea placeholder="Enter Thai description" rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
