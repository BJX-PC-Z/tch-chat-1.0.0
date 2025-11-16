# T.C.H. 聊天室安装指南

本指南将详细介绍如何在不同环境中安装和部署 T.C.H. 聊天室应用。

## 📋 前置要求

### 系统要求
- Node.js 16+ 或 18+
- npm 7+ 或 yarn 1.22+
- 现代浏览器（Chrome 80+、Firefox 75+、Safari 13+、Edge 80+）

### GitHub 仓库要求
- 一个可访问的 GitHub 仓库
- 仓库需要有写入权限（用于创建 Issues）
- 建议创建专门的聊天仓库

## 🚀 安装方式

### 方式一：直接部署到 GitHub Pages（推荐）

1. **Fork 项目**
   ```
   访问: https://github.com/BJX-PC-Z/tch-chat
   点击右上角 "Fork" 按钮
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/你的用户名/tch-chat.git
   cd tch-chat
   ```

3. **修改配置**
   - 编辑 `src/App.tsx` 中的默认仓库配置
   - 将 `owner: 'BJX-PC-Z'` 改为你自己的用户名
   - 将 `repo: 'tch-chat'` 改为你的仓库名

4. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "初始部署"
   git push origin main
   ```

5. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 稍等片刻，访问生成的 URL

### 方式二：本地开发环境

1. **克隆仓库**
   ```bash
   git clone https://github.com/BJX-PC-Z/tch-chat.git
   cd tch-chat
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或者
   yarn install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   # 或者
   yarn dev
   ```

4. **访问应用**
   打开浏览器访问 `http://localhost:5173`

### 方式三：Vercel 部署

1. **准备仓库**
   - Fork 或上传代码到 GitHub 仓库

2. **连接 Vercel**
   - 访问 [Vercel](https://vercel.com/)
   - 点击 "New Project"
   - 选择 GitHub 仓库

3. **配置构建设置**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### 方式四：Netlify 部署

1. **拖拽部署**
   - 构建项目：`npm run build`
   - 将 `dist/` 文件夹拖拽到 [Netlify](https://netlify.com/)

2. **Git 集成部署**
   - 连接 GitHub 仓库
   - 配置构建设置：
     ```
     Build command: npm run build
     Publish directory: dist
     ```

### 方式五：静态文件服务器

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传到服务器**
   - 将 `dist/` 目录上传到 Web 服务器
   - 确保服务器支持 SPA（单页应用）

3. **配置服务器**
   - Apache: 配置 `.htaccess`
   - Nginx: 配置重写规则
   - 查看下方服务器配置部分

## ⚙️ 配置详解

### GitHub 仓库配置

#### 创建专用仓库

```bash
# 使用 GitHub CLI 创建仓库（可选）
gh repo create tch-chat --public --description "T.C.H. 聊天室项目"
```

#### 仓库设置要求

1. **权限设置**
   - 仓库必须是公开的（除非使用 API 密钥）
   - 允许创建 Issues
   - 建议禁用 Issues 模板

2. **标签设置**
   - 建议创建基础标签：
     - `chat` - 聊天消息
     - `discussion` - 讨论
     - `urgent` - 紧急消息
     - `question` - 问题
     - `idea` - 想法

### API 密钥配置（可选）

#### 获取 GitHub API 密钥

1. **创建 Personal Access Token**
   ```
   访问: https://github.com/settings/tokens
   → Developer settings
   → Personal access tokens
   → Tokens (classic)
   → Generate new token
   ```

2. **权限设置**
   ```
   ✓ repo (所有仓库权限)
   ✓ public_repo (公共仓库)
   ```

3. **配置密钥**
   - 在应用中进入设置页面
   - 输入获得的 token
   - 点击测试确认

#### API 密钥优势

| 功能 | 无密钥 | 有密钥 |
|------|--------|--------|
| 每小时请求数 | 60 | 5000 |
| 访问权限 | 仅公开仓库 | 公开+私有仓库 |
| 响应速度 | 较慢 | 较快 |
| 功能限制 | 受限 | 完整功能 |

### 环境变量配置

如果需要自定义配置，可以创建 `.env` 文件：

```bash
# .env
VITE_GITHUB_OWNER=BJX-PC-Z
VITE_GITHUB_REPO=tch-chat
VITE_SYNC_INTERVAL=30000
VITE_API_RATE_LIMIT=60
```

## 🌐 服务器配置

### Apache 配置

在 `public/.htaccess` 中添加：

```apache
Options -MultiViews
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass https://api.github.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static files cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
}
```

## 🔧 故障排除

### 常见问题

#### 1. 页面空白或404错误

**原因**: 路由配置问题或静态文件路径错误

**解决方案**:
- 检查 `vite.config.ts` 中的 `base` 配置
- 确保服务器配置了 SPA 重写规则
- 检查 `index.html` 中的资源路径

#### 2. API 请求失败

**原因**: CORS 限制或权限问题

**解决方案**:
- 使用 API 密钥绕过限制
- 检查仓库权限设置
- 确认网络连接正常

#### 3. 构建失败

**原因**: 依赖问题或代码错误

**解决方案**:
- 删除 `node_modules` 重新安装
- 检查 Node.js 版本
- 查看详细错误信息

#### 4. 部署后样式异常

**原因**: CSS 文件路径问题

**解决方案**:
- 检查 `base` 配置是否正确
- 确保服务器支持正确的 MIME 类型
- 清除浏览器缓存

### 调试技巧

1. **开启开发者工具**
   ```javascript
   // 在浏览器控制台中执行
   localStorage.setItem('tch-debug', 'true');
   ```

2. **查看网络请求**
   - 打开浏览器开发者工具
   - 切换到 Network 标签
   - 刷新页面查看请求状态

3. **检查控制台错误**
   - 查看 Console 标签的错误信息
   - 注意红色错误提示

4. **验证 API 配置**
   ```javascript
   // 在控制台中测试
   console.log('Current config:', {
     owner: 'BJX-PC-Z',
     repo: 'tch-chat'
   });
   ```

## 📊 性能优化

### 构建优化

1. **代码分割**
   ```typescript
   // vite.config.ts
   export default defineConfig({
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
   })
   ```

2. **资源压缩**
   ```bash
   # 使用 gzip 压缩
   npm install -g gzip-cli
   gzip -r dist/
   ```

3. **CDN 配置**
   - 将静态资源上传到 CDN
   - 修改 `vite.config.ts` 中的 `base` 路径

### 运行优化

1. **启用缓存**
   ```typescript
   // Service Worker 注册
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw.js');
   }
   ```

2. **预加载关键资源**
   ```html
   <link rel="preload" href="/src/main.tsx" as="script">
   <link rel="preconnect" href="https://api.github.com">
   ```

## 🔐 安全建议

1. **API 密钥安全**
   - 不要将 API 密钥提交到版本控制
   - 定期轮换密钥
   - 使用环境变量存储

2. **权限最小化**
   - 只授予必要的仓库权限
   - 定期审查访问权限

3. **内容安全**
   - 验证用户输入
   - 防止 XSS 攻击
   - 使用 HTTPS

## 📈 监控和日志

### 错误监控

```typescript
// 错误上报
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // 发送到错误监控服务
});
```

### 性能监控

```typescript
// 性能指标
const perfData = performance.getEntriesByType('navigation')[0];
console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
```

## 📞 获取帮助

如果遇到安装问题：

1. **检查文档**: 仔细阅读本文档
2. **搜索Issues**: 在 GitHub 仓库中搜索类似问题
3. **提交Issue**: 详细描述问题和复现步骤
4. **社区求助**: 在相关技术社区发帖求助

---

**祝您安装顺利！** 🚀