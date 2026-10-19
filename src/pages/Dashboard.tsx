import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  PackageSearch,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import { useInventories } from "@/hooks/useInventories";
import { getInventoryStats } from "@/lib/inventory";

function Dashboard() {
  const { data: inventories = [], isLoading, error, refetch, isFetching } =
    useInventories();

  const stats = useMemo(() => getInventoryStats(inventories), [inventories]);

  if (isLoading) {
    return <p className="state-hint">正在加载看板数据...</p>;
  }

  if (error) {
    return (
      <p className="state-hint state-hint--error">
        加载失败：{error instanceof Error ? error.message : "请稍后重试"}
      </p>
    );
  }

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">首页看板</h1>
          <p className="page__desc">库存概览 · 通过 MSW 模拟接口延迟和持久化</p>
        </div>
        <button
          className="btn btn--ghost"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw aria-hidden="true" size={16} />
          {isFetching ? "刷新中" : "刷新"}
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <Boxes aria-hidden="true" size={18} />
          <p className="stat-card__label">物料种类</p>
          <p className="stat-card__value">{stats.totalKinds}</p>
          <p className="stat-card__foot">种</p>
        </div>

        <div className="stat-card">
          <PackageSearch aria-hidden="true" size={18} />
          <p className="stat-card__label">库存总量</p>
          <p className="stat-card__value">{stats.totalQuantity}</p>
          <p className="stat-card__foot">件</p>
        </div>

        <div className="stat-card stat-card--warning">
          <TriangleAlert aria-hidden="true" size={18} />
          <p className="stat-card__label">低库存预警</p>
          <p className="stat-card__value">{stats.lowStock}</p>
          <p className="stat-card__foot">低于安全库存</p>
        </div>

        <div className="stat-card stat-card--danger">
          <AlertTriangle aria-hidden="true" size={18} />
          <p className="stat-card__label">缺货物料</p>
          <p className="stat-card__value">{stats.outOfStock}</p>
          <p className="stat-card__foot">需要补货</p>
        </div>
      </div>

      <div className="welcome-card">
        <h2>库存运营控制台</h2>
        <p>
          覆盖登录鉴权、受保护路由、请求缓存、乐观更新、表单校验、MSW
          Mock 和组件测试，适合作为前端实习/初级岗位的作品集项目。
        </p>
        <div className="welcome-card__actions">
          <Link to="/inventory" className="btn btn--primary">
            进入库存管理
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
