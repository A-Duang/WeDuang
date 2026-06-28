# 知识库同步流程

> 记录从源文件到知识库的同步规则。每次更新本地源文件后，按此流程同步并提交 Git。

---

## 📂 目录对应关系

| 源文件目录 | 知识库目录 | 说明 |
|-----------|-----------|------|
| `测开指导-md/` | `docs/` | 源 → 目标 |
| 面经-公司名.md | `docs/interviews/公司.md` | 多份面经按公司合并 |
| 面经收集.md | `docs/interviews/overview.md` | 综合面经（测试基础/接口/自动化等） |
| 质量体系文章 | `docs/quality-assurance/` | 直接复制，文件名按下方规则 |
| 01-计算机基础.md | `docs/testing-basics/computer-basics.md` | |
| 02-Java核心技术.md | `docs/testing-basics/java-core.md` | |
| 03-测试理论与策略.md | `docs/testing-basics/testing-theory.md` | |
| 04-Linux与Shell.md | `docs/testing-basics/linux-shell.md` | |
| 05-手撕代码高频题.md | `docs/testing-basics/coding-problems.md` | |
| AI与大模型.md | `docs/testing-basics/ai-llm.md` | |
| 测开校招生项目类型.md | `docs/testing-basics/campus-projects.md` | |

---

## 🔄 标准同步流程

### 步骤 1：新增/更新源文件

在 `D:\note\测开指导\测开指导-md` 中编辑内容。

---

### 步骤 2：同步到知识库

#### 场景 A：面经文件（按公司维度）

**规则：** 同一公司的多份面经源文件 → 合并写入同一个目标文件。

合并时优先使用**最完整、最新**的源文件内容作为主体，其他文件补充进对应公司文档的对应章节（一面/二面/三面）。

示例：
```
源：测开面经-百度.md + 测开面经-百度_测开二面.md + 测开面经-百度_网盘一面.md + 测开面经-百度_综合面.md
目标：docs/interviews/baidu.md
```

写入规则：
1. 优先读取**标准回答版**（有明确一面/二面/三面拆分的）
2. 其他补充内容按时间顺序追加到对应章节
3. 合并完成后检查是否有重复内容

---

#### 场景 B：综合面经（面经收集.md）

**规则：** 直接覆盖写入 `docs/interviews/overview.md`。

内容包含：测试基础、接口测试、自动化、MySQL、性能测试、APP测试、大厂真题、高频八股文。

---

#### 场景 C：质量体系文章

**规则：** 直接复制到 `docs/quality-assurance/`。

文件名映射：
| 源文件名 | 目标文件名 |
|---------|-----------|
| 07-质量体系-测试计划怎么写.md | test-plan.md |
| 07-质量体系-测试报告模板.md | test-report.md |
| 07-质量体系-测试左移测试右移.md | shift-left-right.md |
| 07-质量体系-测试如何参与需求评审.md | requirement-review.md |
| 07-质量体系-持续集成体系下的质量保障.md | ci-quality.md |
| 07-质量体系-如何保障开发代码的质量.md | code-quality.md |
| 07-质量体系-代码覆盖率统计Jacoco技术.md | jacoco.md |

如果新增质量体系文章：
1. 复制到 `docs/quality-assurance/`，文件名按上述规则命名
2. 更新 `docs/quality-assurance/index.md` 的目录导航
3. 更新 `docs/.vitepress/config.mjs` 侧边栏配置

---

#### 场景 D：测试开发基础文章

**规则：** 直接覆盖写入对应文件。

- `01-计算机基础.md` → `docs/testing-basics/computer-basics.md`
- `02-Java核心技术.md` → `docs/testing-basics/java-core.md`
- `03-测试理论与策略.md` → `docs/testing-basics/testing-theory.md`
- `04-Linux与Shell.md` → `docs/testing-basics/linux-shell.md`
- `05-手撕代码高频题.md` → `docs/testing-basics/coding-problems.md`
- `AI与大模型.md` → `docs/testing-basics/ai-llm.md`
- `测开校招生项目类型.md` → `docs/testing-basics/campus-projects.md`

---

### 步骤 3：提交 Git

```bash
cd D:\weduang
git add -A
git commit -m "sync: 更新日期 内容描述"
git push
```

---

## ⚠️ 注意事项

1. **不要**手动修改知识库中由源文件生成的内容，如有差异应在源文件中修改后重新同步
2. **不要**删除 `docs/interviews/links.md` 以外的 links 文件（links.md 已永久移除）
3. 质量保障专栏新增文章时，需同步更新 3 个地方：
   - `docs/quality-assurance/` 文件
   - `docs/quality-assurance/index.md` 导航
   - `docs/.vitepress/config.mjs` 侧边栏
4. 首页 `docs/index.md` 的 features 卡片不需要手动维护（由 VitePress 自动渲染）

---

## 📋 同步记录

| 日期 | 更新内容 | Commit |
|------|---------|--------|
| 2026-04-27 | 新增质量保障专栏（7篇），合并百度/得物面经，优化导航结构 | dfb80d2 |
| 2026-06-28 | 新增 Python 核心技术和缓存消息队列两篇基础知识，更新 BIGO/Shopee 面经 | bbb6af8 |
