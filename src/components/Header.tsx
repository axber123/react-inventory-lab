import { useNavigate } from "react-router-dom";
import { LogOut, PackageCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo">
          <PackageCheck aria-hidden="true" size={24} />
        </span>
        <h2>库存管理系统</h2>
      </div>

      {user && (
        <div className="app-header__user">
          <span className="app-header__avatar" aria-hidden="true">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="app-header__name">
            {user.name}
            <small>{user.role === "admin" ? "管理员" : "查看者"}</small>
          </span>
          <button className="btn btn--ghost" onClick={handleLogout}>
            <LogOut aria-hidden="true" size={16} />
            退出登录
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
