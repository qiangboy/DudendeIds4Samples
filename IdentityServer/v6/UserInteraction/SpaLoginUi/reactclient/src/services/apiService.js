import authService from '../services/authService';

export class ApiService {
  async post(url, body) {
    return await this.configureRequest(url, (fullUrl, headers) => {
      return fetch(fullUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body), // 把数据转换为 JSON 字符串并作为请求体
      });
    })
  }

  async get(url) {
    return await this.configureRequest(url, (fullUrl, headers) => {
      return fetch(fullUrl, {
        method: 'GET',
        headers
      });
    })
  }

  setApiBaseUrl(url) {
    if (
      !url.includes(import.meta.env.VITE_API_BASE_URL) &&
      url.startsWith('http')
    ) {
      throw Error('invalid url.');
    }

    url = `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')}/${url
      .replace(import.meta.env.VITE_API_BASE_URL, '')
      .replace(/^\/+/, '')}`;

    return url;
  }

  async getDefaultHeaaders() {
    return {
      'Content-Type': 'application/json', // 设置请求头为 JSON 格式
      Authorization: `Bearer ${await authService.getAcessToken()}`, // 设置Token
    }
  }

  async configureRequest(url, fetchFunc) {
    url = this.setApiBaseUrl(url);

    return fetchFunc(url, await this.getDefaultHeaaders());
  }
}
