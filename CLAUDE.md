# CLAUDE.md

## 项目概述

阿Duang 的知识库 —— 基于 VitePress 的测试开发分类知识库站点，面向测试开发岗位求职者，包含学习笔记、质量保障实践和各大厂面经。

- **线上地址**：https://weduang.pages.dev/
- **部署平台**：Cloudflare Pages
- **引流机制**：公众号「阿Duang的测开笔记」回复关键词获取口令，解锁文章内容

## 技术栈

- **框架**：VitePress 1.6.x（Vue 3 + Vite）
- **语言**：JavaScript ESM（`"type": "module"`，无 TypeScript）
- **样式**：Vue SFC scoped CSS + VitePress 默认主题扩展
- **部署**：Cloudflare Pages（`_worker.js` 处理重定向）
- **包管理**：npm

## 目录结构

```
docs/
├── .vitepress/
│   ├── config.mjs              # VitePress 配置（导航、侧边栏、搜索）
│   └── theme/
│       ├── index.js             # 主题入口，注册 ArticleGate 组件
│       ├── Layout.vue           # 包裹默认布局 + PasscodeGate 全局遮罩
│       ├── PasscodeGate.vue     # 全局口令门禁（覆盖在页面上）
│       ├── style.css            # 全局自定义样式
│       ├── gateConfig.js        # 门禁配置：站名、关键词、二维码、口令、拦截路径
│       └── components/
│           └── ArticleGate.vue  # 单篇文章门禁组件（在 markdown 中使用）
├── testing-basics/              # 测试开发基础专栏（7 篇）
├── quality-assurance/           # 质量保障专栏（7 篇 + index）
├── interviews/                  # 面经收集（14 家公司 + 总览）
├── about.md                     # 关于页面
└── index.md                     # 首页
```

## 内容板块

| 板块 | 路径 | 文章数 |
|------|------|--------|
| 测试开发基础 | `docs/testing-basics/` | 7 篇（计算机基础、Java、测试理论、Linux、手撕代码、AI、校招项目） |
| 质量保障 | `docs/quality-assurance/` | 7 篇（测试计划、报告、左移右移、需求评审、CI、代码质量、Jacoco） |
| 面经收集 | `docs/interviews/` | 15 篇（总览 + 14 家公司） |

## 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 构建静态站点（输出到 dist/）
npm run preview   # 预览生产构建
```

## 内容同步流程

内容来源于本地 markdown 文件 `D:\note\测开指导\测开指导-md/`，同步到 `docs/` 目录。详见 `SYNC-GUIDE.md`。

关键规则：
- 面经文件：同一公司的多份源文件合并到一个目标文件
- 质量保障文章：直接复制，需同步更新 3 处（文件、index.md 导航、config.mjs 侧边栏）
- **不要**手动修改 docs/ 中由源文件生成的内容，应在源文件中修改后重新同步

## 口令门禁系统

两层访问控制，共用同一个 localStorage key（`weduang-passcode`），解锁一次全站生效：

1. **PasscodeGate**（`PasscodeGate.vue`）：全局遮罩，拦截 `gatedPrefixes` 中配置的路径，展示二维码 + 口令输入框
2. **ArticleGate**（`ArticleGate.vue`）：单篇门禁组件，在 markdown 中通过 `<ArticleGate>` 使用，展示预览内容 + 锁定区域

拦截路径配置在 `gateConfig.js` 的 `gatedPrefixes` 数组中，当前包含：
- `/testing-basics/`
- `/interviews/`
- `/quality-assurance/`

专栏入口页（`indexPages`）不拦截。

修改口令：在浏览器控制台执行 `btoa('新口令')` 获取 base64 值，更新 `gateConfig.js`。

## 开发约定

- 所有 UI 文字使用中文（zh-CN）
- 导航和侧边栏配置在 `docs/.vitepress/config.mjs`
- 不使用 TypeScript，纯 JavaScript ESM
- Vue 组件使用 `<script setup>` + Composition API
- 无测试套件或 lint 工具
- Git commit message 使用前缀：`feat:`、`fix:`、`docs:`、`sync:`
