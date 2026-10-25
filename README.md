# 今时录（NowBlog）— 落地页 + 博客

基于 [Astro](https://astro.build) 构建的现代化个人博客与落地页。默认零 JavaScript、性能优异、SEO 友好，中英文双语，支持明暗主题切换。

- 系统名：中文「今时录」，英文「NowBlog」
- 标语：记录此刻，留存当下

## 功能

- 首页：个人简介 Hero（aurora 光晕动画）、最新文章、关于我
- 博客：基于内容集合（Content Collections）的 Markdown 文章，自动生成列表与详情
- 分类 / 标签 / 作者：`/categories/`、`/tags/`、`/authors/` 三个维度各自有列表页、详情页与 RSS
- 系列导航：`series` + `seriesOrder` 让同一项目的多篇文档按顺序串起来
- 多语言：中文 / 英文双语，导航栏一键切换；界面文案与文章均双语，URL 用 `/en` 前缀
- 明暗主题切换（跟随系统 + 记忆选择，防闪烁）
- RSS 订阅：全站 `(/en/)rss.xml`，另有每个标签、分类、作者的独立 feed
- 站内全文搜索（Pagefind，构建后生效）
- 评论系统（Giscus，按需启用）
- Sitemap + robots.txt（SEO）
- 滚动进入动画、玻璃拟态、悬停发光等精致 UI

## 阅读体验增强

- **归档页**：`/blog/archive/` 与 `/en/blog/archive/`，按年份分组
- **上一篇 / 下一篇 + 相关文章**：相关文章按标签重合度排序
- **封面图（可选）与阅读时长**：文章 `cover` 字段 + 自动估算阅读分钟数
- **草稿 / 未来日期**：`draft` 字段与未来 `pubDate` 在构建时自动剔除，dev 下保留
- **阅读进度条**：纯 CSS 滚动驱动动画（`animation-timeline: scroll()`），零 JS
- **目录 TOC**：文章内 h2/h3 抽取，滚动高亮当前章节；标题悬停显示可复制锚点
- **代码复制按钮**、**回到顶部按钮**、**图片灯箱**（点击放大）
- **代码块（Expressive Code）**：github-light / github-dark 双主题随站点主题切换，支持文件名、行号、行高亮、文字标记；`showLineNumbers` 需要 `@expressive-code/plugin-line-numbers`，已在 `astro.config.mjs` 注册
- **Mermaid 图表**：正文里用 ` ```mermaid ` 围栏写流程图/时序图，构建期转成图表容器，客户端按需渲染并跟随明暗主题；客户端走精简入口 `src/lib/mermaid-lite.ts`，只注册 flowchart 与 sequence，**新增其它图类型需在该文件里注册**

## 技术栈

- Astro 5
- `@astrojs/rss`、`@astrojs/sitemap`
- Pagefind（静态搜索索引）
- Giscus（GitHub Discussions 评论）
- Expressive Code（代码块渲染与双主题高亮）
- Mermaid（文章内图表，按需懒加载；经 `mermaid-lite` 精简入口，只加载用到的图类型）
- Decap CMS（`/admin` 在线写作，经 Cloudflare Pages Functions 做 GitHub OAuth）
- Fontsource 自托管字体：`Noto Serif SC`（中文衬线）、`Tangerine`（英文手写体）

## 本地开发

```bash
npm install      # 安装依赖
npm run dev      # 启动开发服务器 http://localhost:4321
```

> 搜索（Pagefind）、语法高亮、灯箱等增强**只在生产构建后可用**，dev 模式下搜索会显示占位提示。

## 构建与预览

```bash
npm run build    # astro build + pagefind --site dist，产物在 dist/
npm run preview  # 预览生产构建（含可用搜索、语法高亮等）
npm run check    # astro check（类型/模板检查）
```

CI 或提交前建议跑一次 `npm run build` + `npm run check`，两者都是干净的（0 errors）才算说明改动没问题。

> 搜索、语法高亮、归档、灯箱等请在 `npm run build && npm run preview` 下验证，dev 下不可用。

## 换站点身份时必改

1. **域名**：把 `astro.config.mjs` 里的 `site` 与 `public/robots.txt` 的 `Sitemap:` 行**一起**改成同一个真实域名（RSS、Sitemap 链接依赖它）。当前两者均为 `https://nowblog.pages.dev`。
2. **个人信息**：
   - `Hero.astro` / `AuthorCard.astro`（头像字母；品牌名来自 `ui.ts` 的 `brand`）
   - 关于区块：`src/i18n/ui.ts` 的 `about.bio`（长文本，含品牌介绍）
   - `src/consts.ts` 的 `SITE_TITLE / SITE_BRAND / SITE_DESCRIPTION / SITE_EMAIL`
   - 文章 frontmatter 的 `author` 建议一并替换
3. **联系邮箱**：改 `src/consts.ts` 的 `SITE_EMAIL` 即可，`AuthorCard.astro` 的邮箱按钮与页脚 Contact 链接会跟着变。
4. **法务页**：`/privacy`、`/terms`（英站在 `/en/` 下）的正文在 `src/i18n/ui.ts` 的 `privacy.*` / `terms.*`，「最后更新」日期在 `src/consts.ts` 的 `LEGAL_UPDATED`。若更换了评论服务、托管商或加了统计脚本，请同步修改隐私政策正文。

## 评论（Giscus）

文章页已集成 Giscus，并**已为 `skiray/now-blog` 配置好**，开箱即用。如需换成自己的仓库：

1. 在 GitHub 仓库开启 **Settings → Discussions**
2. 安装 [giscus app](https://github.com/apps/giscus)
3. 访问 [giscus.app](https://giscus.app) 生成参数
4. 把生成的 `repo` / `repoId` / `categoryId` 填入 `src/components/Giscus.astro` 顶部的 `GISCUS` 对象

把任意一项改回 `your-` 前缀，评论区会自动关闭并显示占位提示。主题切换会与 Giscus 评论区同步。

## 内容管理后台（/admin）

站点内置 [Decap CMS](https://decapcms.org/)，访问 `/admin` 即可在线写文章，提交后直接推到仓库并触发重新构建。

1. 在 GitHub 创建 OAuth App：Homepage 填站点域名，Authorization callback URL 填 `https://<域名>/callback`
2. 在 Cloudflare Pages 项目的环境变量里配置 `GITHUB_CLIENT_SECRET`（`GITHUB_CLIENT_ID` 已有默认值，可在 `.env.example` 中查看全部变量）
3. `public/admin/config.yml` 里的 `repo` / `base_url` 按需修改

## 部署

构建命令已是 `astro build && pagefind --site dist`，输出目录为 `dist/`。

- **Vercel / Netlify**：导入仓库，框架选 Astro（自动识别），无需额外配置
- **Cloudflare Pages**：构建命令填 `npm run build`，输出目录填 `dist`；`functions/` 会被自动识别为 Pages Functions，供 `/admin` 登录使用
- **GitHub Pages**：用官方 `astro` 部署 Action 或静态托管

## 目录结构

```
src/
├── components/      # Navbar, Hero, LatestPosts, About, Footer, Giscus,
│                    # PostView, PostCard, Pagination, TagCloud, LangSwitch
├── content/
│   ├── config.ts    # 博客集合 schema（含 cover / draft 可选字段）
│   └── blog/        # 文章：zh/ 与 en/ 各一份，同名 slug 对应两种语言
├── i18n/
│   ├── ui.ts        # 界面文案字典与 useTranslations（含 brand / about.bio 长文本）
│   ├── content.ts   # 按语言过滤/排序/分页/归档/相关文章/阅读时长等工具
│   └── rss.ts       # 双语 RSS 生成
├── layouts/         # Layout.astro 全局骨架/主题/SEO/字体
├── lib/
│   └── mermaid-lite.ts # 精简版 Mermaid 入口（只注册 flowchart / sequence）
├── types/           # 深层 import 的类型声明（mermaid 子路径）
├── pages/
│   └── [...locale]/  # 全部页面（含 404），中英文共用同一份实现
│       ├── index.astro       # 首页
│       ├── 404.astro         # 404（生成 /404.html 与 /en/404/）
│       ├── blog/             # 列表、[...slug] 详情、page/[page] 分页、archive 归档
│       ├── tags/             # 标签列表、[tag] 详情与 RSS
│       ├── categories/       # 分类列表、[category] 详情与 RSS
│       ├── authors/          # 作者列表、[name] 详情与 RSS
│       ├── {privacy,terms}   # 法务页
│       ├── rss.xml.ts        # RSS
│       └── search.astro      # 搜索
├── consts.ts        # 站点标题/品牌/描述
└── styles/global.css# 设计令牌与全局样式
functions/           # Cloudflare Pages Functions：/auth 与 /callback（Decap CMS 登录）
public/admin/        # Decap CMS 后台（/admin），配置见 config.yml
```

## 新增博客文章

在 `src/content/blog/zh/` 放一个 `.md`；需要英文版时在 `src/content/blog/en/` 放**同名**的一份。只有单语版本也能正常发布，此时语言切换会把读者带到对应语言的博客列表页，并把该语言入口置灰提示。frontmatter：

```yaml
title: 标题
description: 摘要
pubDate: 2026-01-01
tags: [标签1, 标签2]      # 细分标签，生成 /tags/<tag>/
category: tech-talk       # 可选：必须是 src/data/categories.ts 里注册的 id，写错直接构建失败
series: 系列名            # 可选：系列名，配合 seriesOrder 决定「上一篇/下一篇」顺序
seriesOrder: 1            # 可选：系列内序号（从 1 开始）
author: 作者名            # 默认 Skr
cover: /images/foo.jpg    # 可选：封面图（放在 public/ 下）
draft: false              # 可选：true 时仅 dev 可见，构建不发布
```

- 两边 slug 保持一致，构建即生效并自动出现在对应语言下。
- `category` 用的是**注册表里的 id**（`vibe-coding` / `app` / `bookkeeping` / `tech-talk`），页面上显示的是对应语言的标签。新增分类：往 `src/data/categories.ts` 追加一条，再在 `src/i18n/ui.ts` 里保证 zh/en 两套 `cats.*` 文案齐全。
- 正文不要以 `# ` 开头：页面已经把标题渲染成唯一的 `<h1>`。

