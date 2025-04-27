// 环境配置文件
// 根据不同环境提供不同的配置参数

// 获取当前环境
const ENV = import.meta.env.MODE || 'development';

// 环境配置映射
const envConfig = {
  // 开发环境配置
  development: {
    apiHost: 'https://elec.blanker.cc/api/private',
    apiTimeout: 10000,
    enableLogging: true,
    enableMock: true,
    version: '0.0.0-dev',
  },

  // 测试环境配置
  test: {
    apiHost: 'https://test-api.example.com/api/private',
    apiTimeout: 15000,
    enableLogging: true,
    enableMock: false,
    version: '0.0.0-test',
  },

  // 生产环境配置
  production: {
    apiHost: 'https://elec.blanker.cc/api/private',
    apiTimeout: 20000,
    enableLogging: false,
    enableMock: false,
    version: '0.0.0',
  }
};

// 导出当前环境的配置
const config = envConfig[ENV] || envConfig.development;

export default config;