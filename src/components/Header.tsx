import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ============================================================
 * 【本文件知识点】用 Context 免去 props 一层层传
 *
 * Header 不是 App 的直接子组件（中间隔着 MainLayout）。
 * 没有 Context 的话，"当前用户"得从 App 传给 MainLayout 再传给 Header。
 * 有了 Context，Header 自己 useAuth() 直接收听，中间人不用管。
 *
 * 【JS 知识】&& 短路渲染：user && (...) 意思是
 * "user 存在（不是 null）才渲染右边的东西"。
 * ============================================================ */

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /** 退出登录：清空用户 -> RequireAuth 发现没人登录，自动踢去登录页 */
  function handleLogout() {
    logout();
    // 其实不写这行也会被守卫踢走，但主动跳转一次意图更清楚
    navigate("/login", { replace: true });
  }

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo">📦</span>
        <h2>库存管理系统</h2>
      </div>

      {user && (
        <div className="app-header__user">
          {/* 名字第一个字当头像；slice(0, 1) = 截取第一个字符 */}
          <span className="app-header__avatar">{user.name.slice(0, 1)}</span>
          <span className="app-header__name">{user.name}</span>
          <button className="btn btn--ghost" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
