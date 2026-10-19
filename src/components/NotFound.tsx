import { Link } from "react-router-dom";
import { MapPinOff } from "lucide-react";

function NotFound() {
  return (
    <div className="notfound">
      <span className="notfound__icon">
        <MapPinOff aria-hidden="true" size={44} />
      </span>
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
