import React, { useState } from 'react';
import { ApiService } from '../services/apiService';

const CallApi = () => {
  const [result, setResult] = useState();
  const apiService = new ApiService();

  const callApi = () => {
    apiService
      .get('api/order')
      .then((response) => response.json()) // 处理响应的 JSON 数据
      .then((data) => {
        console.log('返回的数据：', data);
        // 处理返回的数据
        setResult(JSON.stringify(data, null, 2));
      })
      .catch((error) => {
        // 处理错误
        console.error(error);
      });
  };

  return (
    <div>
      <h1>调用WebApi</h1>
      <button onClick={callApi}>调用WebApi</button>
      <pre>{result}</pre>
    </div>
  );
};

export default CallApi;
