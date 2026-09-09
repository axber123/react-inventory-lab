import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

/* ============================================================
 * 【本文件知识点】布局路由 + <Outlet>："页面骨架"只写一次
 *
 * 观察所有页面的共同点：都有顶栏和侧边栏。
 * 如果每个页面都写一遍 <Header /><Sidebar />，改布局就要改 N 个文件。
 *
 * React Router 的方案：一个没有 path 的 <Route> 只负责"包住别人"，
 * 子页面的内容塞到 <Outlet /> 所在的位置：
 *
 *   <Route element={<MainLayout />}>        <- 骨架
 *     <Route path="/dashboard" ... />       <- 显示在 <Outlet/> 里
 *   </Route>
 * ============================================================ */

function MainLayout() {
  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <Sidebar />

        {/* 子页面（Dashboard/Inventory/Detail）渲染在这里 */}
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
