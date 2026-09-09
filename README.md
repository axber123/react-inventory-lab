# react-inventory · React 库存管理学习项目

React 19 + Vite + React Router 7 + **TypeScript** 的教学项目，演示路由、Hooks、Context、单向数据流等核心知识点。
每个源码文件顶部都有教学注释（专有名词第一次出现都会用大白话解释）。

## 启动

```bash
npm install
npm run dev         # 开发服务器，浏览器打开 http://localhost:5173
npm run typecheck   # 只做 TypeScript 类型检查
npm run lint        # 只做代码规范检查
npm run build       # 类型检查 + 打包（模拟上线）
```

登录随便填：任意非空用户名/密码即可（教学项目没有真后端）。

---

## 🗺️ 如何阅读这个项目（推荐路线）

**建议按"站点"顺序读，每站 10~20 分钟。每一站都配了一个小练习，改一行代码、刷新浏览器、亲眼看到变化 —— 这比看十遍都有用。**

### 第 1 站：网页是怎么"开始"的（15 分钟）

| 文件 | 看什么 |
|---|---|
| [index.html](index.html) | 整个网页只有一个空的 `<div id="root">`，其余全靠 JS |
| [src/main.tsx](src/main.tsx) | React 在这里"接管" #root，开始画页面 |

**练习**：改一下 `main.tsx` 里 `<h1>` 不存在——改 `App.tsx` 里 Header 的标题文字（下一步就能看到），保存后浏览器**不刷新也自动更新**，这就是 Vite 的热更新。

### 第 2 站：路由 = 网站的地图（20 分钟）

| 文件 | 看什么 |
|---|---|
| [src/App.tsx](src/App.tsx) | "地址 → 显示哪个页面"的对照表全在这 |
| [src/layouts/MainLayout.tsx](src/layouts/MainLayout.tsx) | 顶栏+侧栏只写一次，`<Outlet/>` 是子页面的"插座" |

**练习**：在 `App.tsx` 里照葫芦画瓢加一条 `<Route path="/about" element={<h1>关于我们</h1>} />`，浏览器访问 `http://localhost:5173/about` 看效果。

### 第 3 站：数据长什么样、从哪来（15 分钟）

| 文件 | 看什么 |
|---|---|
| [src/types.ts](src/types.ts) | 一条物料数据的"形状"（TS 入门） |
| [vite.config.ts](vite.config.ts) | 假后端：数据就是这里造的，改这里=改数据库 |
| [src/api/inventoryApi.ts](src/api/inventoryApi.ts) | fetch 请求怎么写、怎么处理错误 |

**练习**：在 `vite.config.ts` 的 `inventories` 数组里加一条你自己的物料，重启 `npm run dev`（配置文件改了要重启），列表里就多了一行。

### 第 4 站：Hook —— React 的"能力包"（30 分钟，最重要的一站）

| 文件 | 看什么 |
|---|---|
| [src/hooks/useInventory.ts](src/hooks/useInventory.ts) | useState（存会变的数据）、useEffect（页面出现后干活）、改数据为什么必须造新的 |

**练习**：把 `subtractInventory` 里的 `item.quantity > 0` 条件删掉，点减号看会发生什么（数字变负数了！这就是这个条件的作用）。

### 第 5 站：第一个完整页面（20 分钟）

| 文件 | 看什么 |
|---|---|
| [src/pages/Login.tsx](src/pages/Login.tsx) | 受控表单（输入框的值交给 React 保管）、登录成功后怎么跳转 |

**练习**：给登录页加一个"忘记密码？"文字，点击后 `alert("联系管理员")`。

### 第 6 站：列表页面，单向数据流（30 分钟，核心页面）

| 文件 | 看什么 |
|---|---|
| [src/pages/Inventory.tsx](src/pages/Inventory.tsx) | 搜索、列表渲染、key 的作用、"算出来的数据不要存 state" |
| [src/components/InventoryItem.tsx](src/components/InventoryItem.tsx) | 数据从父到子、事件从子到父；为什么事件要包箭头函数 |

**练习**：给 Inventory 加一个"重置搜索"按钮，点击后把 `searchKeyword` 清空。

### 第 7 站：详情页与动态路由（15 分钟）

| 文件 | 看什么 |
|---|---|
| [src/pages/InventoryDetail.tsx](src/pages/InventoryDetail.tsx) | `useParams` 怎么从网址里取编号；依赖 `[id]` 的 useEffect |

**练习**：在详情卡片里加一行"数量是否为 0"，用三元表达式显示"是/否"。

### 第 8 站：全局状态 Context（30 分钟，稍难，最后啃）

| 文件 | 看什么 |
|---|---|
| [src/context/AuthContext.tsx](src/context/AuthContext.tsx) | 为什么需要 Context、createContext/Provider/useContext 三步 |
| [src/components/RequireAuth.tsx](src/components/RequireAuth.tsx) | "安检员"：没登录踢去登录页 |
| [src/pages/Dashboard.tsx](src/pages/Dashboard.tsx) | useMemo 统计数字 |

**练习**：故意把 `main.tsx` 里 `<AuthProvider>` 的包裹去掉，看控制台报的错 —— 这个报错正是 `useAuth` 里的防呆检查打出来的。

### 读不懂某个词？→ 查下面的术语表

---

## 📖 术语表（大白话版）

| 术语 | 大白话 |
|---|---|
| 组件 (Component) | 页面上的一块"积木"。一个函数，返回一段界面描述 |
| JSX | 在 JS 里写 HTML 的语法。`<h1>你好</h1>` 放在 return 里就是 JSX |
| 渲染 (Render) | React 把组件函数执行一遍，算出界面长什么样 |
| state（状态） | 会变的数据。它一变，React 自动更新界面。用 `useState` 声明 |
| props | 父组件传给子组件的数据（子组件只能读，不能改） |
| 挂载 / 卸载 | 组件"出现在页面上" / "从页面上消失" |
| 副作用 (Effect) | "画界面"之外的事：请求数据、定时器……用 `useEffect` 包起来 |
| 依赖数组 | useEffect 的第二个参数，意思是"这些值变了就重新执行" |
| Hook | React 的"能力包"，名字都以 use 开头：useState、useEffect…… |
| 自定义 Hook | 自己打包的能力包（如 useInventory）。复用逻辑，不复用数据 |
| Context | 数据"广播电台"。Provider 包住谁，谁的后代都能直接收听 |
| 受控组件 | 输入框的值交给 React state 保管（value + onChange 成对出现） |
| 单向数据流 | 数据从父到子往下传；子组件想改变什么，通过回调函数往上报 |
| Promise / async / await | "这活要等一会儿" / "等它做完再继续"。网络请求必用 |
| 条件渲染 | 根据条件决定显示什么：`&&`、三元表达式 `? :`、提前 return |
| 热更新 (HMR) | 改代码保存后，浏览器自动局部更新，不用手动刷新 |
| TypeScript (TS) | JavaScript + 类型检查。写错字段名/用错类型，当场画红线 |
| type / 类型标注 | 给数据"定型"：`quantity: number` 表示这个字段必须是数字 |
| 联合类型 | `A \| B`：要么是 A 要么是 B。如 `Inventory \| null`（还没拿到数据） |
| 泛型 | 尖括号里的类型说明：`useState<Inventory[]>` = "这个 state 装物料数组" |
| `?.` 可选链 | 前一级是 null 就直接返回 undefined，不报错：`user?.name` |
| 类型收窄 | TS 通过 if 判断，确定"这里一定不是 null 了"，后面放心用 |

---

## 📂 目录结构

```
src/
├── main.tsx                     应用入口：createRoot 点火 + StrictMode
├── App.tsx                      路由总装：Provider + 路由表
├── types.ts                     共享的数据类型（一条物料长什么样）
├── api/
│   └── inventoryApi.ts          数据请求层（fetch 封装）
├── context/
│   └── AuthContext.tsx          全局登录状态（Context 三步用法）
├── hooks/
│   └── useInventory.ts          库存数据逻辑（自定义 Hook）
├── layouts/
│   └── MainLayout.tsx           布局路由 + <Outlet/>
├── components/                  通用组件
│   ├── Header.tsx               顶栏（useContext 读登录用户）
│   ├── Sidebar.tsx              侧边栏（NavLink 当前页高亮）
│   ├── InventoryItem.tsx        库存列表行（纯展示组件）
│   ├── RequireAuth.tsx          登录守卫
│   └── NotFound.tsx             404 页
└── pages/                       页面组件
    ├── Login.tsx                受控表单 + useNavigate
    ├── Dashboard.tsx            useMemo 统计
    ├── Inventory.tsx            派生数据 + useRef + 列表渲染
    └── InventoryDetail.tsx      useParams + 依赖 [id] 的 effect
```

---

## 🌊 数据流向结构（重点）

### 1. 组件树（谁包着谁）

```
main.tsx  createRoot 点火
└─ <App>                          src/App.tsx
   └─ <AuthProvider>              全局登录状态（Context 广播）
      └─ <BrowserRouter>          路由监听地址栏
         └─ <Routes>              路由表，自上而下匹配
            ├─ /login ──────────► <Login>
            ├─ / ───────────────► <Navigate to="/dashboard">  重定向
            ├─ RequireAuth ─────► 未登录? 踢去 /login
            │  └─ <MainLayout>  布局路由
            │     ├─ <Header>   （useContext 读用户）
            │     ├─ <Sidebar>  （NavLink 高亮）
            │     └─ <Outlet> ──┬─ /dashboard ────► <Dashboard>
            │                   ├─ /inventory ───► <Inventory> ── <InventoryItem> × N
            │                   └─ /inventory/:id ► <InventoryDetail>
            └─ * ───────────────► <NotFound>  兜底 404
```

### 2. 数据流向图（两条"管道"）

```
【数据下行 / props 向下传】
  vite mock 接口 (/api/inventory)
        │ fetch + json()
        ▼
  api/inventoryApi.ts ────────► hooks/useInventory.ts
                                  │ useState 存数据
                                  ▼
                    pages/Inventory.tsx（调用 Hook）
                                  │ props: item / onAdd / onSubtract
                                  ▼
                    components/InventoryItem.tsx（只负责展示）
                                  │ 用户点击 +1
                                  ▼ 事件回调【上行】

【事件上行 / 回调向上报】
  InventoryItem 的 onClick
        │ 调用 props.onAdd()
        ▼
  Inventory 里的 () => addInventory(item.matnr)
        │ 调用 Hook 返回的函数
        ▼
  useInventory 里 setInventories(旧值 => 新数组)
        │ state 变化
        ▼
  React 重新渲染 Inventory → InventoryItem（界面更新，数据又下行）
```

### 3. 不走 props 的"广播"：Context

```
Login 表单提交 ──► useAuth().login(名字) ──► AuthContext 的 state 变化
                                                 │ Provider 广播
                    ┌────────────────────────────┴───────────┐
                    ▼                                        ▼
        Header（显示用户名）                      RequireAuth（放行受保护页面）
```

三句话记住 React 架构：**state 决定界面；事件改 state；跨层共享用 Context。**

---

## 🔤 本项目用到的 TS 语法速查

| 写法 | 出现位置 | 意思 |
|---|---|---|
| `type Inventory = { ... }` | types.ts | 定义一种数据的"形状" |
| `: Promise<Inventory[]>` | inventoryApi.ts | 函数返回"一批物料"（异步） |
| `useState<Inventory[]>([])` | useInventory.ts | 这个 state 装的是物料数组 |
| `Inventory \| null` | AuthContext 等 | 可能是物料，也可能是 null（还没拿到） |
| `if (!context) throw ...` | AuthContext.tsx | 判空之后 TS 确定它非 null（类型收窄） |
| `FormEvent<HTMLFormElement>` | Login.tsx | "表单提交事件"这种事件类型 |
| `{ children }: { children: ReactNode }` | RequireAuth.tsx | props 类型直接内联写 |
| `id!` | InventoryDetail.tsx | 末尾感叹号："我保证它不是 undefined" |
| `getElementById("root")!` | main.tsx | 同上，页面里一定有 root 这个 div |

---

## 📚 知识点索引

| 知识点 | 文件 |
|---|---|
| 入口、StrictMode、渲染流程 | src/main.tsx |
| 路由表、重定向、404、布局路由 | src/App.tsx、src/layouts/MainLayout.tsx |
| mock 接口与前端开发模式 | vite.config.ts |
| TS 类型定义 | src/types.ts |
| fetch 与 API 层封装 | src/api/inventoryApi.ts |
| useState、useEffect、自定义 Hook | src/hooks/useInventory.ts |
| useContext、createContext | src/context/AuthContext.tsx |
| 受保护路由 | src/components/RequireAuth.tsx |
| 受控表单、useNavigate、事件类型 | src/pages/Login.tsx |
| NavLink、props 传事件 | src/components/Sidebar.tsx、InventoryItem.tsx |
| useMemo | src/pages/Dashboard.tsx |
| 派生数据、useRef、列表 key | src/pages/Inventory.tsx |
| useParams、依赖 [id] 的 effect | src/pages/InventoryDetail.tsx |

## 🚀 与真实项目的差距（进阶方向）

- 登录应调后端接口校验，用 token 而不是 sessionStorage 存用户名
- 库存增减应 POST 到后端持久化（目前只改了前端内存）
- 数据量大时用 TanStack Query 管理请求缓存
- 把 `useInventory` 的增减逻辑改写成 `useReducer` 是很好的练习题
