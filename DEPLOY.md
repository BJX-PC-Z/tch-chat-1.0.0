# T.C.H. 聊天室部署说明

## 🚀 快速部署

### 方法一：GitHub Pages（推荐）

1. **Fork 项目**
   ```
   访问: https://github.com/BJX-PC-Z/tch-chat
   点击 "Fork" 按钮
   ```

2. **配置仓库**
   编辑 `src/App.tsx`，修改默认配置：
   ```typescript
   // 找到这行并修改
   owner: '你的GitHub用户名',
   repo: '你的仓库名',
   ```

3. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 保存设置

4. **推送代码**
   ```bash
   git add .
   git commit -m "初始部署"
   git push origin main
   ```

5. **访问应用**
   等待 2-3 分钟，访问生成的 URL

### 方法二：Vercel

1. **上传代码到 GitHub**
2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 导入 GitHub 仓库
3. **配置构建设置**
   ```
   Build Command: npm run build
   Output Directory: dist
   ```
4. **部署**

### 方法三：Netlify

1. **构建项目**
   ```bash
   npm run build
   ```
2. **拖拽部署**
   - 访问 [netlify.com](https://netlify.com)
   - 拖拽 `dist` 文件夹到部署区域

## ⚙️ 详细配置

### 修改仓库设置

编辑 `src/App.tsx` 文件中的默认配置：

```typescript
const defaultConfig = {
  owner: '你的GitHub用户名',  // 修改这里
  repo: '你的仓库名',         // 修改这里
  defaultBranch: 'main',
  labels: {
    chat: 'chat',
    urgent: 'urgent',
    discussion: 'discussion'
  }
};
```

### API 密钥配置（可选）

1. **创建 GitHub Token**
   - 访问 [GitHub Settings → Personal access tokens](https://github.com/settings/tokens)
   - 创建新 token，勾选 `repo` 权限

2. **在应用中配置**
   - 打开应用设置页面
   - 输入获得的 token
   - 保存设置

### 主题自定义

在 `tailwind.config.js` 中修改颜色主题：

```javascript
colors: {
  'tch': {
    primary: '#你的主色',    // 修改主色调
    secondary: '#你的次色调', // 修改次色调
    accent: '#你的强调色',    // 修改强调色
    // ... 其他颜色
  }
}
```

## 🔧 故障排除

### 常见问题

**构建失败**
- 检查 Node.js 版本（需要 16+）
- 删除 `node_modules` 重新安装
- 检查 TypeScript 编译错误

**部署后页面空白**
- 检查 `vite.config.ts` 中的 `base` 配置
- 确保服务器支持 SPA 路由
- 查看浏览器控制台错误

**API 请求失败**
- 确认仓库配置正确
- 检查仓库权限设置
- 考虑添加 GitHub API 密钥

### 调试方法

1. **开启调试模式**
   ```javascript
   // 在浏览器控制台执行
   localStorage.setItem('tch-debug', 'true');
   ```

2. **检查网络请求**
   - 打开开发者工具 → Network
   - 查看 API 请求状态

3. **查看控制台错误**
   - 打开开发者工具 → Console
   - 注意红色错误信息

## 📊 性能优化

### 构建优化

1. **启用代码分割**
   ```typescript
   // vite.config.ts
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
           icons: ['lucide-react']
         }
       }
     }
   }
   ```

2. **资源压缩**
   ```bash
   # 启用 gzip 压缩
   npm install -g gzip-cli
   gzip -r dist/
   ```

### 运行时优化

1. **缓存策略**
   - 浏览器缓存静态资源
   - Service Worker 缓存（可选）

2. **API 优化**
   - 使用 GitHub API 密钥提高限制
   - 调整同步间隔
   - 启用请求去重

## 🔒 安全考虑

### API 密钥安全
- 不要将密钥提交到版本控制
- 使用环境变量存储敏感信息
- 定期轮换密钥

### 权限控制
- 只授予必要的仓库权限
- 定期审查访问权限
- 监控 API 使用情况

### 内容安全
- 验证所有用户输入
- 防止 XSS 攻击
- 使用 HTTPS 协议

## 📈 监控和维护

### 错误监控
```typescript
// 错误上报示例
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // 发送到监控服务
});
```

### 性能监控
```typescript
// 性能指标收集
const perfData = performance.getEntriesByType('navigation')[0];
const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
console.log('Page load time:', loadTime);
```

### 维护建议
- 定期更新依赖包
- 监控 GitHub API 变更
- 备份重要配置
- 定期测试部署流程

## 📞 获取帮助

### 文档资源
- [README.md](./README.md) - 项目概览
- [INSTALL-GUIDE.md](./INSTALL-GUIDE.md) - 详细安装说明
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始指南
- [FILE-LIST.md](./FILE-LIST.md) - 文件结构说明

### 技术支持
- GitHub Issues - 技术问题和Bug报告
- 社区讨论 - 使用技巧和经验分享

### 贡献指南
- Fork 项目
- 创建功能分支
- 提交 Pull Request
- 参与代码审查

---

**祝您部署顺利！** 🎉

如果遇到问题，请参考详细文档或提交 GitHub Issue。