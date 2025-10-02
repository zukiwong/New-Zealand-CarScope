# NZ CarScope Backend API

Trade Me Motors数据聚合和分析API服务

## 📁 项目结构

```
server/
├── src/
│   ├── config/          # 配置模块
│   │   └── index.ts     # 应用配置
│   ├── controllers/     # 控制器层
│   │   ├── market.controller.ts
│   │   └── listings.controller.ts
│   ├── services/        # 服务层
│   │   ├── trademe.service.ts   # Trade Me API封装
│   │   └── market.service.ts    # 市场数据服务
│   ├── routes/          # 路由层
│   │   ├── market.routes.ts
│   │   ├── listings.routes.ts
│   │   └── index.ts
│   ├── middleware/      # 中间件
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   ├── utils/           # 工具函数
│   │   ├── logger.ts    # 日志工具
│   │   └── cache.ts     # 缓存工具
│   ├── types/           # TypeScript类型
│   │   └── index.ts
│   └── index.ts         # 应用入口
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 快速开始

### 安装依赖

```bash
cd server
npm install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件,填入Trade Me API密钥
```

### 运行开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
npm start
```

## 📡 API端点

### 健康检查
- `GET /api/health` - 服务健康检查

### 市场数据
- `GET /api/market/overview` - 获取市场概览
- `GET /api/market/brands?region=Auckland` - 获取品牌统计
- `GET /api/market/brands/:make/models` - 获取车型统计
- `GET /api/market/regions` - 获取区域统计

### 列表数据
- `GET /api/listings/search?make=Toyota&model=Corolla` - 搜索汽车
- `GET /api/listings/recent?count=10` - 获取最新列表
- `GET /api/listings/categories` - 获取分类
- `GET /api/listings/:id` - 获取商品详情

## 🏗 架构设计

### 分层架构

```
┌─────────────────┐
│   Routes        │  路由层 - HTTP路由定义
├─────────────────┤
│   Controllers   │  控制器层 - 请求处理
├─────────────────┤
│   Services      │  服务层 - 业务逻辑
├─────────────────┤
│   Utils         │  工具层 - 缓存/日志
└─────────────────┘
```

### 模块说明

- **config**: 集中管理配置,支持环境变量
- **controllers**: 处理HTTP请求,调用服务层
- **services**: 封装业务逻辑,调用外部API
- **routes**: 定义API路由
- **middleware**: 请求拦截和错误处理
- **utils**: 通用工具(日志、缓存等)
- **types**: TypeScript类型定义

## 🔧 技术栈

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Cache**: node-cache
- **Logger**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## 🔒 安全特性

- Helmet安全头
- CORS跨域控制
- API请求限流
- 环境变量保护
- 错误信息脱敏

## 📊 性能优化

- 多级缓存策略
- 响应压缩
- 并发请求优化
- 连接池复用

## 📝 开发规范

- ESM模块系统
- TypeScript严格模式
- 统一错误处理
- 结构化日志
