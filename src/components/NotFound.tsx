import { Link } from "react-router-dom";

/* ============================================================
 * 【本文件知识点】404 兜底页面
 *
 * 修复前：访问不存在的地址（比如 /abc），路由表没有一条能匹配，
 * 页面内容区就是一片空白。
 *
 * 修复后：路由表最后加一条 <Route path="*">，
 * 星号 = "什么都匹配"，轮到它说明前面全都匹配失败。
 * ⚠️ 它必须放在路由表的最后面（React Router 从上往下找，
 * 找到具体的就先匹配了）。
 * ============================================================ */

function NotFound() {
  return (
    <div className="notfound">
      <p className="notfound__code">404</p>
      <h2>页面不存在</h2>
      <p className="notfound__hint">你访问的地址可能已被移动或删除。</p>

      <Link to="/dashboard" className="btn btn--primary">
        返回首页
      </Link>
    </div>
  );
}

export default NotFound;
