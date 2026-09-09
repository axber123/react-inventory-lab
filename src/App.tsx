import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Demo from "./pages/Demo";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import InventoryDetail from "./pages/InventoryDetail";
import NotFound from "./components/NotFound";
import MainLayout from "./layouts/MainLayout";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

/* ============================================================
 * 【本文件知识点】路由总装：这个文件是整个应用的"骨架/地图"
 *
 * React Router 用 <Routes> 描述"地址 -> 显示哪个组件"。
 * 看懂本文件，整个项目的页面结构就清楚了：
 *
 *   /login            -> Login       登录页（不用登录也能看）
 *   /                 -> 自动跳到 /dashboard
 *   受守卫包住的一组页面（必须登录）：
 *     /dashboard      -> Dashboard
 *     /inventory      -> Inventory
 *     /inventory/:id  -> InventoryDetail（:id = 动态参数）
 *   *（其他任何地址）   -> NotFound
 * ============================================================ */

function App() {
  return (
    /* AuthProvider 放最外层：它包住的范围内（所有页面）都能 useAuth() */
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/demo" element={<Demo></Demo>} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<h1>关于我们</h1>} />

          {/* 重定向：访问 / 时立刻跳到 /dashboard replace = 不留历史记录，后退键不会退回 / */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 受保护的一组页面：RequireAuth 是"安检员"，
              已登录 -> 显示 MainLayout，子页面塞进 <Outlet/> 里
              未登录 -> 被踢去 /login */}
          <Route
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            {/* :id 是动态段：/inventory/100003 时页面里能读到 id="100003" */}
            <Route path="/inventory/:id" element={<InventoryDetail />} />
          </Route>

          {/* 兜底 404：必须放最后（从上往下匹配，前面都对不上才轮到它） */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
