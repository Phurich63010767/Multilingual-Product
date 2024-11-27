import React, { useEffect, useState } from 'react';
import { Table, Input, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [language, setLanguage] = useState('en');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        console.log('API Response:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const translation = product.translations.find(
      (t) => t.language === language
    );
    return (
      translation?.name.toLowerCase().includes(searchText.toLowerCase()) ||
      translation?.description.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => {
        const translation = record.translations.find(
          (t) => t.language === language
        );
        return translation?.name || 'N/A';
      },
    },
    {
      title: 'Description',
      key: 'description',
      render: (_, record) => {
        const translation = record.translations.find(
          (t) => t.language === language
        );
        return translation?.description || 'N/A';
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Product List</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Select
          value={language}
          onChange={(value) => setLanguage(value)}
          style={{ width: '150px' }}
        >
          <Option value="en">English</Option>
          <Option value="th">ไทย</Option>
        </Select>

        <Input
          placeholder="Search products"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>

      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default Home;
