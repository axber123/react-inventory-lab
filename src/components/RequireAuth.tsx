import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

/* ============================================================
 * 【本文件知识点】受保护路由（登录守卫）
 *
 * 需求：没登录的人不能看看板/库存页，要自动跳去登录页。
 * 做法：写一个"安检员"组件包住真正的页面：
 *   - 已登录：放行，原样渲染 children（包住的内容）
 *   - 未登录：渲染 <Navigate to="/login">，它一出现地址栏就跳走
 *
 * 【React 知识】children：写在 <组件>这里</组件> 的内容。
 * 【TS 知识】ReactNode = "任何能渲染的东西"（文字、标签、组件……）
 * 【React 知识】replace={true}：跳转不留历史记录，按"后退"不会回来。
 * state={{ from: location }}：顺手记下"用户本来想去哪"，
 *   登录成功后直接送他回原页面（体验更好的经典做法）。
 * ============================================================ */

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // 收听 Context 里的登录状态
  const location = useLocation(); // 当前地址信息（去哪了、要干嘛）

  // 未登录 -> 渲染跳转组件，children 压根不会出现
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 已登录 -> 放行
  return children;
}

export default RequireAuth;
