---
title: 杂谈与个人网站制作
published: 2026-02-24
description: 从购买域名、用 GitHub + Vercel 当「服务器」，到选模板做网页的完整流程，适合零基础搭个人博客。
tags: [博客, 建站, Vercel, GitHub, 域名, 静态站点]
category: 建站
draft: false
---
## 零、为什么要做网站
其实很早就想做一个个人网站了，但由于一直没时间，再加上一直觉得自己不擅长javscript不擅长前端制作，做不太出什么好的网页效果，就一直拖着没做。但是，AI时代来临之后，个人博客的制作从未如此简单。实际上，这个项目我一行代码都没有敲。我只是在告诉我的智能体：我们先抄一下这个模板，然后你给我把那张图换成那张图，把哪个功能撤掉，然后再新增哪个按钮，给什么做一个渐变效果等等。然后，等几分钟，Agent就告诉我一切都做好了。

---

## 一、整体思路

个人博客不必自己买服务器、配 Nginx。可以这样做：

1. **买一个域名**（例如 `yourname.xyz`），方便记忆和分享。
2. **用 GitHub 存代码**：博客当做一个「仓库」，改完就 push。
3. **用 Vercel 当「服务器」**：Vercel 连上 GitHub，每次 push 自动帮你构建、发布成网站。
4. **做网页**：用现成博客模板（如 Astro/Mizuki、Hexo、Hugo 等）改内容即可，不用从零写 HTML。

下面按「域名 → GitHub + Vercel → 网页」的顺序说。

---

## 二、购买域名

### 2.1 选域名后缀

常见的有 `.com`、`.cn`、`.xyz`、`.net` 等。`.com` 最贵也最稳；`.xyz`、`.top` 等往往便宜，适合个人站。选一个没被占用的、好记的即可。

### 2.2 在哪里买

- **国内**：阿里云（万网）、腾讯云、华为云等，需要实名认证，备案后可在国内服务器用。
- **国外**：Namecheap、Cloudflare Registrar、Google Domains（已并入 Squarespace）等，不用备案，直接解析到国外服务（如 Vercel）即可。

购买时按页面提示填写信息、付款，拿到域名的「管理权」后，就可以去配置解析。

### 2.3 解析到 Vercel（后面会用到）

域名买好后，在域名服务商的控制台里找到「DNS 解析」或「Nameservers」。后面在 Vercel 里添加你的域名时，Vercel 会告诉你：要么把「NS 记录」改成 Vercel 提供的，要么在域名这边添加一条「CNAME 记录」指到 Vercel 给的地址（如 `cname.vercel-dns.com`）。按 Vercel 的提示操作即可，生效一般要几分钟到几小时。

---

## 三、用 GitHub 存博客代码

### 3.1 注册 GitHub

到 [github.com](https://github.com) 注册账号（已有可跳过）。

### 3.2 新建仓库

- 点 **New repository**，仓库名可以叫 `my-blog`、`blog` 等。
- 选 **Public**，勾不勾 **Add a README** 都行（若用模板，后面会把模板代码 push 上去）。

### 3.3 本地和 GitHub 关联

在电脑上装好 **Git**，在博客项目目录里执行：

```bash
git init
git remote add origin https://github.com/你的用户名/你的仓库名.git
git add .
git commit -m "初始提交"
git branch -M main
git push -u origin main
```

之后每次改完博客，执行 `git add .`、`git commit -m "说明"`、`git push`，代码就同步到 GitHub 了。

---

## 四、用 Vercel 实现「服务器」功能

Vercel 会把你的仓库「构建」成静态网页并托管，相当于免费、自动的服务器 + 自动部署。

### 4.1 注册并导入项目

1. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录。
2. 点 **Add New… → Project**，在列表里选你的博客仓库（如 `my-blog`），**Import**。
3. 进入项目设置页，**不要急着 Deploy**，先看下面「构建配置」。

### 4.2 配置构建方式（关键）

不同博客框架命令不一样，按你用的来填（若用模板，一般说明里会写）：

| 项目 | 说明 | 常见值（示例） |
|------|------|----------------|
| **Framework Preset** | 框架类型 | 选 Astro / Hugo / Other 等 |
| **Build Command** | 构建命令 | 如 `pnpm build` 或 `npm run build` |
| **Output Directory** | 构建产物目录 | 如 `dist` 或 `public` |
| **Install Command** | 安装依赖命令 | 如 `pnpm install` 或 `npm install` |

例如：**Astro + pnpm** 时填：

- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

若仓库根目录有 `vercel.json` 且里面对了，Vercel 有时会自动识别，否则在 **Settings → General → Build & Development Settings** 里手动填上述三项。

### 4.3 部署与自动更新

点 **Deploy** 后，Vercel 会拉取你仓库的代码、执行安装和构建、发布成一个网址（如 `xxx.vercel.app`）。

之后只要你在本地 `git push` 到 GitHub，Vercel 会**自动重新构建并更新网站**，不用自己点发布。

### 4.4 绑定自己的域名

1. 在 Vercel 项目里进 **Settings → Domains**。
2. 输入你买的域名（如 `jingjingya.xyz`），按提示添加。
3. 按页面说明，回到域名服务商那里添加 **CNAME** 或修改 **NS**，指到 Vercel。
4. 等 DNS 生效后，访问你的域名就能打开博客。如需强制 HTTPS，Vercel 默认会处理。

---

## 五、如何「制作网页」：用模板而不是从零写

完全从零写 HTML/CSS/JS 成本高，个人博客一般用现成方案。

### 5.1 常见方案对比

| 方案 | 特点 | 适合谁 |
|------|------|--------|
| **静态站点生成器 + 模板** | 写 Markdown，生成静态 HTML，部署到 Vercel/Netlify | 想自己控样式、又不想写太多代码 |
| **Hexo / Hugo** | 主题多，文档多，命令行生成静态站 | 习惯 Markdown、喜欢折腾主题 |
| **Astro + 博客主题（如 Mizuki）** | 现代前端栈，主题好看，构建快 | 想要好看界面、能接受一点配置 |
| **Notion / 语雀 + 第三方托管** | 在 Notion 里写，用工具转成站 | 只想写内容、几乎不碰代码 |

### 5.2 推荐流程（以 Astro 博客模板为例）

1. **选一个开源博客模板**（如 GitHub 上搜 "Astro blog theme"），把模板代码下载或 clone 到本地。
2. **按模板文档改配置**：站点名、简介、域名、导航栏、友链等，一般在 `config.ts` 或 `_config.yml` 里。
3. **写文章**：在模板规定的目录（如 `src/content/posts/`）里新建 `.md` 文件，用 Markdown 写正文，头部用 frontmatter 写标题、日期、标签等。
4. **本地预览**：在项目里执行 `pnpm install`、`pnpm dev`，浏览器打开 `http://localhost:4321` 看效果。
5. **推送到 GitHub**：确认没问题后 `git push`，Vercel 自动部署，网站就更新了。

这样你主要是在「改配置 + 写 Markdown」，不必写前端逻辑；网页长什么样由模板决定，你只关心内容和简单配置即可。

### 5.3 若完全不想碰代码

可以用 **Vercel 的一键部署**：在 [vercel.com/templates](https://vercel.com/templates) 或 GitHub 上找「Deploy to Vercel」的博客模板，点一下就把仓库 fork 到你账号并部署好，你再在 GitHub 网页上改 Markdown 或简单配置，也能更新博客。

---

## 六、流程小结

| 步骤 | 做什么 | 得到什么 |
|------|--------|----------|
| 1. 买域名 | 在域名商选域名、付款、拿到管理权 | 一个可解析的域名（如 yourname.xyz） |
| 2. 建 GitHub 仓库 | 新建 repo，本地 git 关联并 push | 博客代码在云端，可随时改 |
| 3. 用 Vercel 部署 | 导入 GitHub 仓库，填构建命令与输出目录 | 自动构建 + 托管，得到一个 xxx.vercel.app 网址 |
| 4. 绑定域名 | 在 Vercel 添加域名，在域名商做 DNS 解析 | 用自己域名访问博客 |
| 5. 选模板做网页 | 用 Astro/Hexo 等模板，改配置、写 Markdown | 实际看到的博客页面 |

整体成本：域名每年几十到百来块（视后缀和商家），GitHub 与 Vercel 在个人用量下免费，服务器和维护成本为零。你只需要写文章和偶尔改改配置，就能长期运营一个个人博客。
