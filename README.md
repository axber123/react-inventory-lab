# React Inventory Portfolio SPA

一个面向前端实习/初级岗位的 React + TypeScript 库存管理系统作品集项目。项目保留少量教学说明，但核心结构按真实前端项目组织：API 分层、TanStack Query 缓存、MSW Mock、React Hook Form + Zod 表单校验、路由守卫、Vitest + Testing Library 测试、可静态部署。

## Preview

> 本地启动后访问 `http://localhost:5173`。  
> 演示账号：用户名任意非空，密码至少 6 位；输入 `admin` 会显示管理员角色。

![登录页与库存看板](./docs/preview-placeholder.png)

## Features

- 登录鉴权：`/api/auth/login` mock API，登录态保存在 `sessionStorage`，刷新不掉线。
- 受保护路由：未登录访问 `/dashboard`、`/inventory` 会跳转到 `/login`，登录后回到原页面。
- 库存看板：物料种类、库存总量、低库存、缺货统计，由 TanStack Query 缓存数据派生。
- 库存列表：关键词、分类、库存状态组合筛选，筛选条件同步到 URL query。
- 库存调整：`+1/-1` 使用 TanStack Query mutation，带 optimistic update 和失败回滚。
- 库存详情：动态路由 `/inventory/:id` 独立请求详情，支持直接刷新详情链接。
- Mock 持久化：MSW 模拟接口，库存调整写入 `localStorage`，刷新后保留演示数据。
- 工程化：`@/` 路径别名、ESLint、TypeScript strict、Vitest、Testing Library、MSW worker。

## Tech Stack

| 分类 | 技术 |
| --- | --- |
| 核心 | React 19、TypeScript、Vite |
| 路由 | React Router 7 |
| 数据请求 | TanStack Query、fetch |
| Mock | MSW、localStorage |
| 表单 | React Hook Form、Zod |
| UI | 原生 CSS、lucide-react |
| 测试 | Vitest、Testing Library、jsdom |
| 代码质量 | ESLint、typescript-eslint |

## Quick Start

```bash
npm install
npm run dev
```

默认启用 MSW Mock，不需要真实后端。

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

## Environment

复制 `.env.example` 创建本地 `.env`：

```bash
VITE_ENABLE_MOCK=true
VITE_API_BASE_URL=/api
```

- `VITE_ENABLE_MOCK=true`：启动 MSW 浏览器 worker，适合本地演示和静态部署。
- `VITE_ENABLE_MOCK=false`：关闭 MSW，将请求转发到 `VITE_API_BASE_URL` 指向的真实后端。
- 静态部署时必须保留 `public/mockServiceWorker.js`，否则 build 后的 mock 接口不可用。

## Architecture

```txt
src/
├── api/                 请求层：fetch 封装、接口函数
├── components/          通用组件：Header、Sidebar、InventoryItem、RequireAuth
├── context/             认证上下文：AuthProvider + useAuth
├── hooks/               TanStack Query hooks：列表、详情、库存调整 mutation
├── layouts/             布局路由：MainLayout + Outlet
├── lib/                 业务纯函数、QueryClient、Zod schema
├── mocks/               MSW handlers、浏览器 worker、测试 server、mock DB
├── pages/               页面：Login、Dashboard、Inventory、InventoryDetail
├── test/                测试环境初始化
└── types.ts             共享类型
```

关键数据流：

```txt
页面组件
  -> hooks/useInventories.ts
  -> api/inventoryApi.ts
  -> /api/inventory
  -> mocks/handlers.ts
  -> mocks/db.ts(localStorage)

库存调整：
InventoryItem onAdjust
  -> useAdjustInventory().mutate
  -> optimistic update 更新 Query cache
  -> POST /api/inventory/:matnr/adjust
  -> 成功后 invalidate，失败后 rollback
```

## API Contract

### `POST /api/auth/login`

```json
{
  "username": "admin",
  "password": "123456"
}
```

返回：

```json
{
  "user": {
    "name": "admin",
    "role": "admin"
  }
}
```

### `GET /api/inventory?keyword=&category=&status=`

返回 `Inventory[]`。`status` 可选值为 `out-of-stock`、`low`、`normal`。

### `GET /api/inventory/:matnr`

返回单条 `Inventory`，不存在时返回 `404`。

### `POST /api/inventory/:matnr/adjust`

```json
{
  "delta": 1
}
```

返回更新后的 `Inventory`。库存为 0 时继续减库存会返回 `409`。

## Testing

```bash
npm run test
```

覆盖点：

- 库存状态、筛选、统计、数量调整等纯函数。
- `InventoryItem` 的减库存禁用逻辑和事件回调。
- 登录表单校验、登录成功跳转。
- 库存列表加载与关键词筛选。

## Deployment

这是一个静态 SPA，可部署到 Vercel、Netlify、GitHub Pages 或任意静态服务器。

```bash
npm run build
npm run preview
```

部署前确认：

- 构建设置：`npm run build`
- 输出目录：`dist`
- 单页应用 fallback：所有路径回退到 `index.html`
- Mock 演示：保留 `VITE_ENABLE_MOCK=true` 与 `public/mockServiceWorker.js`

## Interview Talking Points

- 为什么用 TanStack Query 替代页面上各自 `useEffect + useState` 请求：缓存、去重、加载状态、mutation 和 invalidate 更统一。
- optimistic update 怎么保证用户体验：点击加减立即更新列表和详情缓存，接口失败后回滚。
- `RequireAuth + Navigate state.from` 如何实现登录后回跳。
- 为什么筛选条件同步 URL：可分享、可刷新、可回到上一个查询状态。
- MSW 在开发、测试、静态部署中的价值：不依赖真实后端，也能测试真实 fetch 行为。
- 哪些地方是 mock 局限：认证不是安全边界，localStorage mock DB 不是生产数据库。

更详细的教学拆解见 [docs/learning-notes.md](./docs/learning-notes.md)。

## Resume Description

可以写成：

> React 库存管理系统｜个人前端作品集项目  
> 技术栈：React 19、TypeScript、Vite、React Router、TanStack Query、MSW、React Hook Form、Zod、Vitest。  
> 基于 React Router 设计公开路由、受保护路由和动态详情路由；使用 TanStack Query 统一列表/详情请求缓存与库存调整 mutation，并实现 optimistic update 和失败回滚；使用 MSW 模拟 REST API 与 localStorage 持久化，构建无后端可演示版本；使用 React Hook Form + Zod 完成登录表单校验；补充 Vitest + Testing Library 测试，覆盖业务纯函数、组件交互和页面流程。

不要写：

- 不写 JWT、数据库、Redis、Docker、SSR、微前端、Redux、WebSocket。
- 不写“高并发”“生产级千万数据”“团队协作上线”，这个项目是个人作品集 mock 项目。
