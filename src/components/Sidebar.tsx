import { NavLink } from "react-router-dom";

/* ============================================================
 * 【本文件知识点】Link vs NavLink
 *
 * 两个都会渲染成 <a> 标签，点击后由 React Router 换页面
 * （不会像传统网站那样整页刷新）：
 *   <Link>      普通跳转
 *   <NavLink>   多一个本事：如果当前地址正好是 to 的地址，
 *               自动给 <a> 加上高亮的 class —— 侧边栏"当前页高亮"
 *               就是靠它实现的！
 *
 * 【TS/JS 知识】className 传一个函数，参数 { isActive } 是
 * React Router 递给你的："现在匹配上了吗？" true/false。
 * 我们拿它拼出不同的 class 名字。
 * ============================================================ */

function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="sidebar__title">导航菜单</p>

      <nav className="sidebar__nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            // isActive 为 true 返回"高亮样式"，否则只有基础样式
            isActive ? "nav-link nav-link--active" : "nav-link"
          }
        >
          <span>🏠</span> 首页看板
        </NavLink>

        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            isActive ? "nav-link nav-link--active" : "nav-link"
          }
        >
          <span>📋</span> 库存管理
        </NavLink>
      </nav>

      <div className="sidebar__footer">
        <p>React 学习项目</p>
        <p>Vite + Router + TS</p>
      </div>
    </aside>
  );
}

export default Sidebar;
