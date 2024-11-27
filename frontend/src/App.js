import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import AddProduct from './pages/AddProduct';
import Home from './pages/Home';
import './App.css';

const App = () => {
  const navigate = useNavigate();

  return (
      <div>
        <div className="button-group">
          <Button className="nav-button" type="primary" onClick={() => navigate('/')}>
            Product List
          </Button>
          <Button className="nav-button" type="primary" onClick={() => navigate('/add-product')}>
            Add Product
          </Button>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </div>
  );
};

export default App;
