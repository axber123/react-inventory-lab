import { NavLink } from "react-router-dom";
import { ClipboardList, LayoutDashboard } from "lucide-react";

const navItems = [
  {
    to: "/dashboard",
    label: "首页看板",
    icon: LayoutDashboard,
  },
  {
    to: "/inventory",
    label: "库存管理",
    icon: ClipboardList,
  },
] as const;

function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="sidebar__title">导航菜单</p>

      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              <Icon aria-hidden="true" size={17} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <p>React Portfolio SPA</p>
        <p>React Query + MSW + Vitest</p>
      </div>
    </aside>
  );
}

export default Sidebar;
