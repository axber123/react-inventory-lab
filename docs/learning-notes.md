# Learning Notes

这份文档承接原 README 的教学内容。源码只保留必要短注释，长解释集中在这里。

## 1. React 应用如何启动

- `index.html` 只提供 `<div id="root">`。
- `src/main.tsx` 负责启动 MSW、创建 `QueryClient`，再用 `createRoot` 渲染 `<App />`。
- `<StrictMode>` 只在开发环境做额外检查，可能让 effect 执行两次，接口请求出现两次并不代表 bug。

## 2. 路由设计

- `/login` 是公开页面。
- `/` 重定向到 `/dashboard`。
- `/dashboard`、`/inventory`、`/inventory/:id` 被 `RequireAuth` 保护。
- `*` 兜底 404。
- `RequireAuth` 拦截时把当前 location 放进 `state.from`，登录成功后回到用户原本要去的页面。

## 3. 认证 Context

- `AuthProvider` 用 `useState` 保存 `user`。
- 初始化时从 `sessionStorage` 恢复用户，刷新页面仍保持登录。
- `login` 现在会调用 mock API，而不是直接信任前端输入。
- `value` 用 `useMemo` 包住，避免无关渲染制造新对象。

注意：这是作品集 mock 项目，认证不是安全边界。真实项目需要后端签发 token 并在服务端校验权限。

## 4. TanStack Query

项目用 `useInventories`、`useInventoryDetail`、`useAdjustInventory` 统一请求状态。

- `queryKey` 是缓存身份：列表缓存带筛选条件，详情缓存带 `matnr`。
- `keepPreviousData` 让列表筛选切换时保留上一批数据，减少闪烁。
- mutation 使用 `onMutate` 做 optimistic update，`onError` 回滚，`onSettled` 重新校验。

对比旧写法：以前每个页面各自 `useEffect + useState` 请求，Dashboard 和 Inventory 会各发一次请求，数据也不共享；现在由 Query cache 统一管理。

## 5. API 层

- `api/http.ts` 封装 fetch，统一处理 `response.ok` 和错误消息。
- `api/inventoryApi.ts` 只暴露业务接口函数。
- 页面和 hooks 不直接拼接口地址，方便以后切换真实后端。

## 6. MSW Mock

- `src/mocks/handlers.ts` 定义 REST API。
- `src/mocks/db.ts` 是内存 mock DB，调整库存时写入 `localStorage`。
- 开发浏览器通过 `setupWorker` 拦截请求。
- 测试环境通过 `setupServer` 复用同一批 handlers。

这比把 mock 写在 Vite 中间件里更接近真实项目：前端请求走标准 fetch，测试和浏览器能复用同一套接口行为。

## 7. 表单校验

登录页使用 React Hook Form + Zod：

- `useForm` 管理字段和提交状态。
- `zodResolver(loginSchema)` 把 Zod 校验规则接入表单。
- 校验失败展示字段级错误，提交失败展示接口错误。

## 8. 业务派生

`src/lib/inventory.ts` 放纯函数：

- `getStockStatus`
- `filterInventories`
- `getInventoryStats`
- `adjustInventoryItem`

这些函数容易测试，也能被页面、mock API 和 mutation 复用。

## 9. 测试策略

- 纯函数测试覆盖库存状态、筛选、统计和数量边界。
- 组件测试覆盖 `InventoryItem` 的按钮禁用和事件回调。
- 页面测试覆盖登录校验、登录跳转、库存加载和筛选。
- MSW server 让测试走真实 fetch 路径，而不是 mock 掉 hooks 或 api 函数。

## 10. 高频面试回答

### 为什么使用 TanStack Query？

因为它把请求缓存、加载状态、错误状态、去重、mutation 和缓存失效统一起来。手写 `useEffect + useState` 只能满足最简单的单页面请求，一旦多个页面共享数据，就会出现重复请求和同步困难。

### optimistic update 是什么？

用户点击 `+1/-1` 后，先立刻更新本地 Query cache，让界面马上变化；接口失败时用 `onMutate` 保存的旧数据回滚，并展示错误。用户感知更快，同时数据最终一致。

### 为什么筛选条件放 URL？

URL 是页面状态的一部分。放 URL 后，筛选结果可分享、可刷新、可前进后退，比只存在组件 state 更符合真实业务系统。

### 为什么还保留 sessionStorage？

本项目的 mock 登录态需要刷新保持。真实项目应使用后端 token、HttpOnly Cookie 或安全存储策略，不能把用户名当作权限证明。

### 这个项目离生产还差什么？

- 真实后端、数据库和权限校验。
- token / cookie 鉴权和服务端授权。
- 更完整的错误监控、埋点和审计日志。
- 更细的 E2E 测试和 CI/CD。
- 如果数据规模变大，需要分页、排序、服务端筛选和索引优化。
