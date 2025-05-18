import React from 'react';
import { Input, Space, Button} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

const SearchBar = ({ 
  placeholder = "Rechercher...", 
  onSearch, 
  loading = false,
  allowClear = true,
  style = {}
}) => {
  return (
    <Space direction="vertical" style={{ width: '100%', ...style }}>
      <Search
        placeholder={placeholder}
        onSearch={onSearch}
        loading={loading}
        allowClear={allowClear}
        enterButton={
          <Button type="primary" icon={<SearchOutlined />}>
            Rechercher
          </Button>
        }
        size="large"
      />
    </Space>
  );
};

export default SearchBar;