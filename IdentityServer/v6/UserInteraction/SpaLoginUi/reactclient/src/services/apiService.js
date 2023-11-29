import authService from '../services/authService';

export class ApiService {
  async post(url, body) {
    url = this.setApiBaseUrl(url);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 设置请求头为 JSON 格式
        Authorization: `Bearer ${await authService.getAcessToken()}`, // 设置Token
      },
      body: JSON.stringify(body), // 把数据转换为 JSON 字符串并作为请求体
    });
  }

  setApiBaseUrl(url) {
    if (
      !url.includes(process.env.REACT_APP_API_BASE_URL) &&
      url.startsWith('http')
    ) {
      throw Error('invalid url.');
    }

    url = `${process.env.REACT_APP_API_BASE_URL.replace(/\/+$/, '')}/${url
      .replace(process.env.REACT_APP_API_BASE_URL, '')
      .replace(/^\/+/, '')}`;

    return url;
  }
}
