# T.C.H. 聊天室 - Thought Crossing Hub (思维交汇处)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-部署-blue)](https://github.com/BJX-PC-Z/tch-chat)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4-yellow)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-cyan)](https://tailwindcss.com/)

## 项目简介

T.C.H. (Thought Crossing Hub) 是一个基于 GitHub Issues 的实时聊天室应用，旨在为开发者和技术爱好者提供一个无需登录的思维交流平台。

### 核心理念：思维交汇处

我们的愿景是创造一个真正开放的思维空间，让不同的想法在这里碰撞、融合，产生智慧的火花。通过GitHub Issues的透明性和可追溯性，我们确保每个想法都被记录，每个讨论都有意义。

## ✨ 特色功能

### 🚀 无需登录，即开即用
- 匿名参与讨论，保护用户隐私
- 基于GitHub账号，无额外注册流程
- 快速接入，随时参与思维交流

### 📝 基于 GitHub Issues
- 消息持久化存储，永不丢失
- 完整的历史记录和搜索功能
- 原生支持 Markdown 格式
- 标签分类管理

### 🌐 实时同步
- 自动刷新机制
- 实时状态指示
- 智能重连功能
- 连接健康监控

### 🎨 现代化设计
- 响应式布局，支持移动端
- 深色/浅色主题切换
- 直观的用户界面
- 优雅的动画效果

### 🔧 高级功能
- 消息搜索和筛选
- 作者和标签过滤
- 实时统计信息
- API密钥支持（提高性能）

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **UI组件**: 自定义组件库
- **状态管理**: React Hooks
- **数据存储**: GitHub Issues API
- **部署平台**: GitHub Pages

## 🚀 快速开始

### 在线体验

直接访问 [T.C.H. 聊天室](https://bjx-pc-z.github.io/tch-chat/) 即可开始使用！

### 本地运行

1. **克隆仓库**
```bash
git clone https://github.com/BJX-PC-Z/tch-chat.git
cd tch-chat
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:5173`

### 构建部署

```bash
npm run build
# 或
yarn build
```

构建后的文件位于 `dist/` 目录，可以部署到任何静态文件托管服务。

## ⚙️ 配置说明

### 仓库配置

在设置页面中配置 GitHub 仓库：

```
格式: 用户名/仓库名
示例: BJX-PC-Z/tch-chat
```

**注意事项**：
- 仓库必须存在且可访问
- 建议创建一个专门用于聊天的仓库
- 仓库需要有写入权限才能发送消息

### API密钥（可选）

为了获得更好的性能和更高的请求限制，建议配置 GitHub API 密钥：

1. 访问 [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. 创建新的 token，勾选 `repo` 权限
3. 在设置页面中输入 token

**没有API密钥的限制**：
- 每小时最多60次请求
- 只能访问公开仓库

**配置API密钥后**：
- 每小时最多5000次请求
- 可以访问私有仓库
- 更高的响应速度

## 📱 使用指南

### 发送消息

1. 在消息输入框中填写标题和内容
2. 可选择添加标签便于分类
3. 点击"发送消息"按钮

### 搜索和筛选

- **快速搜索**: 使用顶部搜索框
- **作者过滤**: 选择特定作者的消息
- **标签过滤**: 按标签筛选消息
- **排序选项**: 最新、最旧、热门

### 消息管理

- **查看详情**: 点击消息卡片查看完整内容
- **跳转GitHub**: 点击消息跳转到GitHub Issues页面
- **回复消息**: 在GitHub页面直接回复

## 🎨 自定义主题

支持深色和浅色主题，主题设置会自动保存到本地存储。

## 📊 统计信息

应用提供实时统计：
- 总消息数
- 活跃用户数
- 新消息数量
- 回复率统计

## 🔧 开发指南

### 项目结构

```
tch-chat/
├── public/                 # 静态资源
├── src/
│   ├── components/         # React组件
│   │   ├── ui/            # 基础UI组件
│   │   ├── Header.tsx     # 头部组件
│   │   ├── MessageList.tsx # 消息列表
│   │   └── ...
│   ├── hooks/             # 自定义Hooks
│   ├── services/          # API服务
│   ├── types/             # TypeScript类型
│   ├── utils/             # 工具函数
│   └── App.tsx            # 主应用
├── package.json
└── README.md
```

### 开发命令

```bash
# 开发模式
npm run dev

# 类型检查
npm run type-check

# 代码规范检查
npm run lint

# 构建
npm run build

# 预览构建结果
npm run preview
```

### 添加新功能

1. 创建新的组件文件
2. 在 `src/components/` 目录中添加
3. 在主应用中引用
4. 添加相应的类型定义
5. 更新样式和交互逻辑

## 🌟 最佳实践

### 消息编写建议

1. **标题**: 简洁明了，概括要点
2. **内容**: 详细阐述，支持Markdown格式
3. **标签**: 选择合适的分类标签
4. **回复**: 在GitHub页面进行深入讨论

### 性能优化

1. 使用GitHub API密钥提高请求限制
2. 合理设置自动刷新间隔
3. 使用筛选减少渲染负担
4. 定期清理浏览器缓存

## 🔒 安全说明

- 所有数据存储在GitHub Issues中
- 不收集或存储用户个人信息
- API密钥仅存储在本地
- 遵循GitHub API使用条款

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 贡献方式

1. Fork 仓库
2. 创建特性分支
3. 提交更改
4. 发起Pull Request

### 开发规范

- 使用TypeScript编写代码
- 遵循ESLint规则
- 编写清晰的提交信息
- 添加必要的测试

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目：

- [React](https://reactjs.org/) - 用户界面库
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Lucide Icons](https://lucide.dev/) - 图标库
- [GitHub API](https://docs.github.com/en/rest) - 数据存储

## 📞 联系我们

- **GitHub**: [BJX-PC-Z](https://github.com/BJX-PC-Z)
- **项目地址**: [tch-chat](https://github.com/BJX-PC-Z/tch-chat)
- **在线体验**: [T.C.H. 聊天室](https://bjx-pc-z.github.io/tch-chat/)

---

## 🎯 未来规划

- [ ] 支持图片上传
- [ ] 添加表情反应
- [ ] 实现消息线程
- [ ] 支持更多GitHub功能
- [ ] 移动端应用开发
- [ ] 多语言支持

---

**让每个想法都有回响，让每场讨论都有价值。**
**T.C.H. - 思维交汇处，一个真正属于思想者的空间。**