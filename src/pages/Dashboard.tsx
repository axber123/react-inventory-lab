import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useInventory } from "../hooks/useInventory";

/* ============================================================
 * 【本文件知识点】useMemo：给计算结果"记答案"
 *
 * 组件每次更新界面，函数体都会从头到尾重新跑一遍，
 * 里面的求和、计数也就重新算一遍。数据少无所谓，
 * 数据上万条就浪费了。
 *
 * useMemo(计算函数, [依赖])：
 *   依赖没变 -> 直接用上次算好的答案，不重算
 *   依赖变了 -> 重算一遍，并把新答案记住
 *
 * 心态提示：useMemo 是"省力气"用的，不用它结果也一样对。
 * 小项目可以不用，这里演示写法。本页面顺便验证了自定义 Hook
 * "复用逻辑不复用数据"—— Dashboard 和库存管理页各有一份独立数据。
 * ============================================================ */

function Dashboard() {
  const { inventories, loading, error } = useInventory();

  // 一组统计数字。只有 inventories 变化时才重新计算
  const stats = useMemo(() => {
    // reduce：把数组"归拢"成一个值（这里是求和，0 是起始值）
    const totalQuantity = inventories.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    // filter：筛出符合条件的元素组成新数组，.length 就是计数
    const outOfStock = inventories.filter((item) => item.quantity === 0).length;
    const lowStock = inventories.filter(
      (item) => item.quantity > 0 && item.quantity < 10,
    ).length;

    return { totalQuantity, outOfStock, lowStock };
  }, [inventories]);

  // 加载中 / 出错时提前返回，下面的代码就不用管这两种情况了
  if (loading) {
    return <p className="state-hint">正在加载看板数据...</p>;
  }

  if (error) {
    return <p className="state-hint state-hint--error">加载失败：{error}</p>;
  }

  return (
    <div className="page">
      <h1 className="page__title">首页看板</h1>
      <p className="page__desc">库存概览 · 模拟了 600ms 网络延迟</p>

      {/* 四张统计卡片（网格布局，样式见 App.css 的 .stat-grid） */}
      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-card__label">物料种类</p>
          <p className="stat-card__value">{inventories.length}</p>
          <p className="stat-card__foot">种</p>
        </div>

        <div className="stat-card">
          <p className="stat-card__label">库存总量</p>
          <p className="stat-card__value">{stats.totalQuantity}</p>
          <p className="stat-card__foot">件</p>
        </div>

        <div className="stat-card stat-card--warning">
          <p className="stat-card__label">低库存预警</p>
          <p className="stat-card__value">{stats.lowStock}</p>
          <p className="stat-card__foot">低于 10 件</p>
        </div>

        <div className="stat-card stat-card--danger">
          <p className="stat-card__label">缺货物料</p>
          <p className="stat-card__value">{stats.outOfStock}</p>
          <p className="stat-card__foot">需要补货</p>
        </div>
      </div>

      <div className="welcome-card">
        <h2>👋 欢迎来到 React 库存管理学习项目</h2>
        <p>
          这个项目演示了路由、Hooks、Context、单向数据流等核心知识点。
          每个文件顶部都有教学注释，阅读路线图见 README.md。
        </p>
        <div className="welcome-card__actions">
          <Link to="/inventory" className="btn btn--primary">
            进入库存管理
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
