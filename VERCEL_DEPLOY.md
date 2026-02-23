# Vercel 部署说明

本博客使用 **Mizuki (Astro)** 模板，部署在 **Vercel** 上。

## 托管信息

- **托管平台**：Vercel
- **GitHub 仓库**：https://github.com/gange-niubi/my-blog
- **网站域名**：https://jingjingya.xyz
- **本地项目路径**：`F:\blog\my-blog`

## Vercel 项目设置

在 Vercel 项目 **Settings → General → Build & Development Settings** 中确认：

| 项 | 值 |
|---|---|
| **Framework Preset** | Astro（或 Other） |
| **Build Command** | `pnpm build` |
| **Output Directory** | `dist` |
| **Install Command** | `pnpm install` |

项目根目录已包含 `vercel.json`，上述配置会由 Vercel 自动识别；若未生效，可在控制台手动填写以上三项。

## 日常部署流程

推送代码后 Vercel 会自动拉取并构建部署，无需额外操作。

```bash
git add .
git commit -m "你的提交说明"
git push
```

首次从 Hexo 切换到 Mizuki 时，可使用：

```bash
git add .
git commit -m "切换到Mizuki模板"
git push
```

## 本地开发

```bash
# 安装依赖（需先安装 pnpm：npm install -g pnpm）
pnpm install

# 启动开发服务器
pnpm dev
# 访问 http://localhost:4321

# 本地预览构建结果
pnpm build
pnpm preview
```

## 新建文章

```bash
pnpm new-post "文章标题"
```

文章将生成在 `src/content/posts/` 下，编辑 frontmatter 与正文即可。
