import React from 'react';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import SchemaBuilder from './components/SchemaBuilder';

const App = () => {
  return (
    <ConfigProvider>
      <SchemaBuilder />
    </ConfigProvider>
  );
};

export default App;
